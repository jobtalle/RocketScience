/**
 * A byte buffer which can be written to and read from.
 * @param {Uint8Array} [source] A binary source to initialize the buffer with.
 * @constructor
 */
export function ByteBuffer(source) {
    let bytes;
    let at = 0;

    /**
     * Get the bytes contained by this buffer.
     * @returns {Uint8Array} The bytes.
     */
    this.getBytes = () => new Uint8Array(bytes);

    /**
     * Write 8 bits to the buffer.
     * @param {Number} byte An unsigned integer in the range [0, 255].
     */
    this.writeByte = byte => {
        bytes.push(byte);
    };

    /**
     * Write 16 bits to the buffer.
     * @param {Number} short An unsigned integer in the range [0, 65535].
     */
    this.writeShort = short => {
        bytes.push((short >> 8) & 0xFF);
        bytes.push(short & 0xFF);
    };

    /**
     * Read 8 bits from the buffer.
     * @returns {Number} An unsigned integer in the range [0, 255].
     */
    this.readByte = () => {
        return bytes[at++];
    };

    /**
     * Read 16 bits from the buffer.
     * @returns {Number} An unsigned integer in the range [0, 65535].
     */
    this.readShort = () => {
        return (bytes[at++] << 8) | bytes[at++];
    };

    if (source)
        bytes = Array.from(source);
    else
        bytes = [];
}