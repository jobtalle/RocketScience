import {ByteBuffer} from "../utils/byteBuffer";
import {Pcb} from "./pcb";
import {getPartFromId, getPartId} from "../part/objects";
import Pako from "pako"
import {Part} from "../part/part";
import {Fixture} from "../part/fixture";
import {PcbPoint} from "./point/pcbPoint";

/**
 * A storage format for PCB's.
 * Stored PCB's are as small as possible.
 * @param {Uint8Array} [bytes] A binary source to initialize the file with. Only set this when reading.
 * @constructor
 */
export function PcbFile(bytes) {
    const encodeHead = (buffer, pcb) => {
        let head = pcb.getWidth() & PcbFile.HEAD_BITS_WIDTH;

        if(pcb.getPoint(0, 0) === null)
            head |= PcbFile.HEAD_BIT_START_EMPTY;

        buffer.writeShort(head);
    };

    const encodeRunEmpty = (buffer, length) => {
        while (length > PcbFile.POINT_RUN_MAX) {
            buffer.writeByte(PcbFile.POINT_RUN_MAX);
            buffer.writeByte(PcbFile.POINT_SKIP);

            length -= PcbFile.POINT_RUN_MAX;
        }

        buffer.writeByte(length);
    };

    const encodeRunPoints = (buffer, points, encodedParts, count, maxCount) => {
        for (let i = 0; i < points.length; ++i) {
            const point = points[i];

            let byte = i === points.length - 1?0:PcbFile.POINT_BIT_CHAIN;

            for (let direction = 1; direction < 5; ++direction) if (point.hasDirection(direction))
                byte |= 1 << (direction - 1);

            if (++count === maxCount)
                byte |= PcbFile.POINT_BIT_LAST;

            if (point.part !== null && !encodedParts.includes(point.part)) {
                encodedParts.push(point.part);

                if (point.part.getConfigurationIndex() !== 0)
                    byte |= PcbFile.POINT_BIT_CONFIGURED;

                buffer.writeByte(byte | PcbFile.POINT_BIT_PART);
                buffer.writeByte(getPartId(point.part.getDefinition().object));

                if (point.part.getConfigurationIndex() !== 0)
                    buffer.writeByte(point.part.getConfigurationIndex());
            }
            else
                buffer.writeByte(byte);
        }

        return count;
    };

    const encode = (buffer, pcb) => {
        const encodedParts = [];

        let count = 0;
        let runEmpty = pcb.getPoint(0, 0) === null;
        let runPoints = [];

        encodeHead(buffer, pcb);

        for (let y = 0; y < pcb.getHeight(); ++y) for (let x = 0; x < pcb.getWidth(); ++x) {
            const point = pcb.getPoint(x, y);
            const empty = point === null;

            if (empty !== runEmpty) {
                if (runEmpty)
                    encodeRunEmpty(buffer, runPoints.length);
                else
                    count = encodeRunPoints(buffer, runPoints, encodedParts, count, pcb.getPointCount());

                runEmpty = empty;
                runPoints = [point];
            }
            else
                runPoints.push(point);
        }

        if (!runEmpty)
            encodeRunPoints(buffer, runPoints, encodedParts, count, pcb.getPointCount());
    };

    const decode = (buffer, pcb) => {
        const head = buffer.readShort();
        const width = head & PcbFile.HEAD_BITS_WIDTH;
        const fixtures = [];

        let point = head & PcbFile.HEAD_BIT_START_EMPTY?PcbFile.POINT_SKIP:buffer.readByte();
        let x = 0;
        let y = 0;

        while (true) {
            if (point === PcbFile.POINT_SKIP) {
                const runLength = buffer.readByte();

                for (let i = 0; i < runLength; ++i) if (++x === width)
                    x = 0, ++y;

                point = buffer.readByte();
            }
            else {
                const pcbPoint = pcb.extend(x, y);

                for (let direction = 1; direction < 5; ++direction) if (((point >> (direction - 1)) & 0x01) === 0x01) {
                    const delta = PcbPoint.directionToDelta(direction);

                    pcbPoint.etchDirection(direction);
                    pcb.getPoint(x + delta.x, y + delta.y).etchDirection(PcbPoint.invertDirection(direction));
                }

                if ((point & PcbFile.POINT_BIT_PART) === PcbFile.POINT_BIT_PART) {
                    const id = buffer.readByte();

                    let configuration = 0;

                    if ((point & PcbFile.POINT_BIT_CONFIGURED) === PcbFile.POINT_BIT_CONFIGURED)
                        configuration = buffer.readByte();

                    fixtures.push(new Fixture(new Part(getPartFromId(id), configuration), x, y));
                }

                if (++x === width)
                    x = 0, ++y;

                if ((point & PcbFile.POINT_BIT_LAST) === PcbFile.POINT_BIT_LAST)
                    break;
                else if ((point & PcbFile.POINT_BIT_CHAIN) === PcbFile.POINT_BIT_CHAIN)
                    point = buffer.readByte();
                else
                    point = PcbFile.POINT_SKIP;
            }
        }

        for (const fixture of fixtures)
            pcb.place(fixture.part, fixture.x, fixture.y);
    };

    /**
     * Store a pcb in this file. This overwrites the previously stored pcb in this file.
     * @param {Pcb} pcb A pcb.
     */
    this.encode = pcb => {
        const buffer = new ByteBuffer();

        encode(buffer, pcb);

        bytes = Pako.deflate(buffer.getBytes(), {"level": 9, "memLevel": 9});
        console.log("Compression ratio: " + Math.round((buffer.getBytes().length / bytes.length) * 100) + "%");
        console.log(bytes.length + "B");

        console.log(this.toString());
    };

    /**
     * Decode the pcb stored in this file.
     * The file must be populated with data first!
     * @returns {Pcb} The pcb that was stored in this file, or null if nothing was stored.
     */
    this.decode = () => {
        if (!bytes)
            return null;

        const buffer = new ByteBuffer(Pako.inflate(bytes));
        const pcb = new Pcb();

        decode(buffer, pcb);

        return pcb;
    };

    /**
     * Convert the data to a string.
     * @returns {String} A string containing this files' data.
     */
    this.toString = () => btoa(String.fromCharCode.apply(null, bytes));

    /**
     * Use the data from a string obtained through the toString method.
     * @param {String} string A string obtained through the toString method.
     */
    this.fromString = string => {
        bytes = new Uint8Array(atob(string).split("").map(c => c.charCodeAt(0)));
    };
}

/**
 * Create a PcbFile from an instantiated PCB.
 * @param {Pcb} pcb A pcb.
 */
PcbFile.fromPcb = pcb => {
    const file = new PcbFile();

    file.encode(pcb);

    return file;
};

PcbFile.HEAD_BIT_START_EMPTY = 0x8000;
PcbFile.HEAD_BITS_WIDTH = PcbFile.HEAD_BIT_START_EMPTY - 1;
PcbFile.POINT_RUN_MAX = 0xFF;
PcbFile.POINT_BIT_CHAIN = 0x10;
PcbFile.POINT_BIT_PART = 0x20;
PcbFile.POINT_BIT_LAST = 0x40;
PcbFile.POINT_BIT_CONFIGURED = 0x80;
PcbFile.POINT_SKIP = PcbFile.POINT_BIT_CONFIGURED;