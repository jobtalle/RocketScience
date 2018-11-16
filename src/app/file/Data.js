import {ByteBuffer} from "../utils/byteBuffer";
import Pako from "pako"

/**
 * A generic file containing binary data.
 * Use wrappers to make different types of files out of this.
 * Files stored as a Data object will be compressed.
 * @constructor
 */
export function Data() {
    let _buffer = null;

    /**
     * Return the buffer to read from or write to this data.
     * @returns {ByteBuffer} The buffer.
     */
    this.getBuffer = () => _buffer;

    /**
     * Set the bytes of this data. The bytes are assumed to be compressed.
     * @param {Uint8Array} bytes An array of bytes.
     */
    this.setBytes = bytes => _buffer = new ByteBuffer(Pako.inflate(bytes));

    /**
     * Get the bytes of this data. The bytes will be compressed.
     * @returns {Uint8Array} The bytes.
     */
    this.getBytes = () => Pako.deflate(_buffer.getBytes(), Data.PAKO_CONFIG);

    /**
     * Convert the data to a string.
     * @returns {String} A string containing this files' data.
     */
    this.toString = () => btoa(String.fromCharCode.apply(null, this.getBytes()));

    /**
     * Use the data from a string obtained through the toString method.
     * @param {String} string A string obtained through the toString method.
     */
    this.fromString = string => {
        this.setBytes(new Uint8Array(atob(string).split("").map(c => c.charCodeAt(0))));
    };
}

Data.PAKO_CONFIG = {
    "level": 9,
    "memLevel": 9
};