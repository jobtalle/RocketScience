/**
 * A byte buffer which can be written to and read from.
 * @constructor
 */
export function ByteBuffer() {
    const bytes = [];
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
     * Write 32 bits to the buffer.
     * @param {Number} int An unsigned integer in the range [0, 4294967295].
     */
    this.writeInt = int => {
        bytes.push((int >> 24) & 0xFF);
        bytes.push((int >> 16) & 0xFF);
        bytes.push((int >> 8) & 0xFF);
        bytes.push(int & 0xFF);
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

    /**
     * Read 32 bits from the buffer.
     * @returns {Number} An unsigned integer in the range [0, 4294967295].
     */
    this.readInt = () => {
        return (bytes[at++] << 24) | (bytes[at++] << 16) | (bytes[at++] << 8) | bytes[at++];
    };
}