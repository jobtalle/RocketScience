/**
 * A byte buffer which can be written to and read from.
 * @param {Uint8Array} [source] A binary source to initialize the buffer with.
 * @constructor
 */
export function ByteBuffer(source) {
    let _bytes;
    let _at = 0;

    /**
     * Get the bytes contained by this buffer.
     * @returns {Uint8Array} The bytes.
     */
    this.getBytes = () => new Uint8Array(_bytes);

    /**
     * Write 8 bits to the buffer.
     * @param {Number} byte An unsigned integer in the range [0, 255].
     */
    this.writeByte = byte => {
        _bytes.push(byte);
    };

    /**
     * Write 16 bits to the buffer.
     * @param {Number} short An unsigned integer in the range [0, 65535].
     */
    this.writeShort = short => {
        _bytes.push((short >> 8) & 0xFF);
        _bytes.push(short & 0xFF);
    };
    /**
     * Write a string with unknown length to the buffer.
     * @param {String} string A string of unknown length.
     */
    this.writeString = string => {

    };

    /**
     * Read 8 bits from the buffer.
     * @returns {Number} An unsigned integer in the range [0, 255].
     */
    this.readByte = () => {
        return _bytes[_at++];
    };

    /**
     * Read 16 bits from the buffer.
     * @returns {Number} An unsigned integer in the range [0, 65535].
     */
    this.readShort = () => {
        return (_bytes[_at++] << 8) | _bytes[_at++];
    };

    this.readString = () => {

    };

    if (source)
        _bytes = Array.from(source);
    else
        _bytes = [];
}