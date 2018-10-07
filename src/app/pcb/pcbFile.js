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
    const writeBoardRun = (buffer, points, empty) => {
        if (points.length === 0)
            return;

        if (empty)
            buffer.writeByte(PcbFile.BOARD_RUN_EMPTY_BIT | points.length);
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

            if (empty !== chunkEmpty || chunkPoints.length === PcbFile.BOARD_RUN_LENGTH_MAX) {
                writeBoardRun(buffer, chunkPoints, chunkEmpty);

                chunkEmpty = empty;
                chunkPoints = [point];
            }
            else
                chunkPoints.push(point);
        }

        if (chunkPoints.length > 0)
            writeBoardRun(buffer, chunkPoints, chunkEmpty);

        buffer.writeByte(0);
    };

    const writePartRun = (buffer, padding, part) => {
        while (padding > PcbFile.PART_RUN_LENGTH_MAX) {
            buffer.writeByte(PcbFile.PART_RUN_LENGTH_MAX);
            buffer.writeByte(PcbFile.PART_ID_VOID);

            padding -= PcbFile.PART_RUN_LENGTH_MAX;
        }

        buffer.writeByte(padding);
        buffer.writeByte(getPartId(part.getDefinition().object));
        buffer.writeByte(part.getConfigurationIndex());
    };

    const encodeParts = (buffer, pcb) => {
        const handled = [];

        let run = 0;

        for (let y = 0; y < pcb.getHeight(); ++y) for (let x = 0; x < pcb.getWidth(); ++x) {
            const point = pcb.getPoint(x, y);

            if (point && point.part && !handled.includes(point.part)) {
                handled.push(point.part);

                writePartRun(buffer, run, point.part);

                run = 1;
            }
            else
                ++run;
        }

        buffer.writeByte(PcbFile.PART_RUN_LENGTH_EOF);
    };

    const decodeBoard = (buffer, pcb) => {
        const width = buffer.readShort();

        let x = 0;
        let y = 0;
        let runLength;

        while (runLength = buffer.readByte(), runLength !== 0) {
            const empty = (runLength & PcbFile.BOARD_RUN_EMPTY_BIT) === PcbFile.BOARD_RUN_EMPTY_BIT;

            runLength &= ~PcbFile.BOARD_RUN_EMPTY_BIT;

            for (let i = 0; i < runLength; ++i) {
                if (!empty)
                    pcb.extend(x, y).paths = buffer.readByte();

                if (++x === width)
                    x = 0, ++y;
            }
        }
    };

    const decodeParts = (buffer, pcb) => {
        let x = 0;
        let y = 0;
        let runLength;

        while (runLength = buffer.readByte(), runLength !== PcbFile.PART_RUN_LENGTH_EOF) {
            for (let i = 0; i < runLength; ++i) if (++x === pcb.getWidth())
                x = 0, ++y;

            const id = buffer.readByte();

            if (id === PcbFile.PART_ID_VOID)
                continue;

            pcb.place(new Part(getPartFromId(id), buffer.readByte()), x, y);
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

PcbFile.BOARD_RUN_EMPTY_BIT = 0x80;
PcbFile.BOARD_RUN_LENGTH_MAX = 127;
PcbFile.PART_ID_VOID = 0xFF;
PcbFile.PART_RUN_LENGTH_MAX = 0xFF - 1;
PcbFile.PART_RUN_LENGTH_EOF = 0xFF;