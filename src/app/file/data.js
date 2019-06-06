import {ByteBuffer} from "../utils/byteBuffer";
import Pako from "pako"
import * as md5 from "md5";

/**
 * A generic file containing binary data.
 * Use wrappers to make different types of files out of this.
 * Files stored as a Data object will be compressed.
 * @constructor
 */
export function Data() {
    let _buffer = new ByteBuffer();

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
    this.fromString = string => this.setBytes(new Uint8Array(atob(string).split("").map(c => c.charCodeAt(0))));

    /**
     * Get the compressed bytes contained by this data.
     * @returns {Blob} An octet-stream blob containing the data.
     */
    this.getBlob = () => new Blob([this.getBytes()], {type: "application/octet-stream"});

    /**
     * Set the bytes of this data from a blob.
     * @param {Blob} blob An octet-stream blob.
     * @param {Function} callback A function that will be called once the blob has been loaded.
     */
    this.setBlob = (blob, callback) => {
        const fileReader = new FileReader();

        fileReader.addEventListener("loadend", () => {
            this.setBytes(new Uint8Array(fileReader.result));

            callback();
        });

        fileReader.readAsArrayBuffer(blob);
    };

    /**
     * Creates a hash from the mission.
     * @returns {string} The hash of the mission
     */
    this.toHash = () => {
        const string =  btoa(String.fromCharCode.apply(null, _buffer.getBytes()));

        return md5(string);
    };
}

Data.PAKO_CONFIG = {
    "level": 9,
    "memLevel": 9
};