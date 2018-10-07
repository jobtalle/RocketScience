import {ByteBuffer} from "../utils/byteBuffer";
import {Pcb} from "./pcb";
import {getPartFromId, getPartId} from "../part/objects";
import Pako from "pako"
import {Part} from "../part/part";

/**
 * A storage format for PCB's.
 * Stored PCB's are as small as possible.
 * @param {Uint8Array} [bytes] A binary source to initialize the file with. Only set this when reading.
 * @constructor
 */
export function PcbFile(bytes) {
    const writeChunk = (buffer, points, empty) => {
        if (points.length === 0)
            return;

        if (empty)
            buffer.writeByte(PcbFile.CHUNK_EMPTY_BIT | points.length);
        else {
            buffer.writeByte(points.length);

            for (const point of points)
                buffer.writeByte(point.paths & 0xFF);
        }
    };

    const encodeBoard = (buffer, pcb) => {
        buffer.writeShort(pcb.getWidth());

        let chunkEmpty = false;
        let chunkPoints = [];

        for(let y = 0; y < pcb.getHeight(); ++y) for(let x = 0; x < pcb.getWidth(); ++x) {
            const point = pcb.getPoint(x, y);
            const empty = point === null;

            if (empty !== chunkEmpty || chunkPoints.length === PcbFile.CHUNK_LENGTH_MAX) {
                writeChunk(buffer, chunkPoints, chunkEmpty);

                chunkEmpty = empty;
                chunkPoints = [point];
            }
            else
                chunkPoints.push(point);
        }

        if (chunkPoints.length > 0)
            writeChunk(buffer, chunkPoints, chunkEmpty);

        buffer.writeByte(PcbFile.CHUNK_LAST);
    };

    const encodeParts = (buffer, pcb) => {
        buffer.writeShort(pcb.getFixtures().length);

        for (const fixture of pcb.getFixtures()) {
            buffer.writeShort(fixture.x);
            buffer.writeShort(fixture.y);
            buffer.writeByte(getPartId(fixture.part.getDefinition().object));
            buffer.writeByte(fixture.part.getConfigurationIndex());
        }
    };

    const decodeBoard = (buffer, pcb) => {
        const width = buffer.readShort();

        let x = 0;
        let y = 0;
        let chunkLength;

        while (chunkLength = buffer.readByte(), chunkLength !== PcbFile.CHUNK_LAST) {
            const empty = (chunkLength & PcbFile.CHUNK_EMPTY_BIT) === PcbFile.CHUNK_EMPTY_BIT;

            chunkLength &= ~PcbFile.CHUNK_EMPTY_BIT;

            for (let i = 0; i < chunkLength; ++i) {
                if (!empty)
                    pcb.extend(x, y).paths = buffer.readByte();

                if (++x === width)
                    x = 0, ++y;
            }
        }
    };

    const decodeParts = (buffer, pcb) => {
        const partCount = buffer.readShort();

        for (let i = 0; i < partCount; ++i) {
            const x = buffer.readShort();
            const y = buffer.readShort();
            const id = buffer.readByte();
            const configuration = buffer.readByte();

            pcb.place(new Part(getPartFromId(id), configuration), x, y);
        }
    };

    /**
     * Store a pcb in this file. This overwrites the previously stored pcb in this file.
     * @param {Pcb} pcb A pcb.
     */
    this.encode = pcb => {
        const buffer = new ByteBuffer();

        encodeBoard(buffer, pcb);
        encodeParts(buffer, pcb);

        bytes = Pako.deflate(buffer.getBytes());
        console.log("Compression ratio: " + Math.round((buffer.getBytes().length / bytes.length) * 100) + "%");

        console.log(this.toHex());
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

        decodeBoard(buffer, pcb);
        decodeParts(buffer, pcb);

        return pcb;
    };

    /**
     * Convert the data to a hexadecimal string.
     * @returns {String} A string containing this files' data in hexadecimal format.
     */
    this.toHex = () => {
        if (!bytes)
            return "";

        let result = "";

        for (const byte of bytes)
            result += "0" + byte.toString(16);

        return result;
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

PcbFile.CHUNK_LENGTH_MAX = 127;
PcbFile.CHUNK_EMPTY_BIT = 0x80;
PcbFile.CHUNK_LAST = 0x00;