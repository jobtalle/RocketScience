import Pako from "pako"
import {ByteBuffer} from "../utils/byteBuffer";

/**
 * A storage format for PCB's.
 * Stored PCB's are as small as possible.
 * @constructor
 */
export function PcbFile() {
    let bytes = null;

    /**
     * Store a pcb in this file.
     * @param {Pcb} pcb A pcb.
     */
    this.encode = pcb => {
        bytes = new ByteBuffer();

        console.log(pcb.getWidth());
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

/**
 * Create a PcbFile from bytes.
 * @param {Uint8Array} bytes The source bytes.
 */
PcbFile.fromBytes = bytes => {
    return new PcbFile();
};