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
     * Write 8 signed bits to the buffer.
     * @param {Number} byte A signed integer in the range [-128, 127].
     */
    this.writeByteSigned = byte => {
        if (byte >= 0)
            _bytes.push(byte);
        else
            _bytes.push(((128 + byte) & 0x7F) | 0x80);
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
     * Write 32 bits to the buffer.
     * @param {Number} int An unsigned integer in the range [0, 4294967295].
     */
    this.writeInt = int => {
        _bytes.push((int >> 24) & 0xFF);
        _bytes.push((int >> 16) & 0xFF);
        _bytes.push((int >> 8) & 0xFF);
        _bytes.push(int & 0xFF);
    };

    /**
     * Write 32 bits to the buffer.
     * @param {Number} float A floating point number.
     */
    this.writeFloat = float => {
        const buffer = new ArrayBuffer(4);
        const floatBuffer = new Float32Array(buffer);

        floatBuffer[0] = float;

        this.writeInt(new Int32Array(buffer)[0]);
    };

    /**
     * Write a string with unknown length to the buffer.
     * @param {String} string A string of unknown length.
     */
    this.writeString = string => {
        this.writeShort(string.length);
        for (let idx = 0; idx < string.length; ++idx)
            this.writeShort(string.charCodeAt(idx));
    };

    /**
     * Read 8 bits from the buffer.
     * @returns {Number} An unsigned integer in the range [0, 255].
     */
    this.readByte = () => {
        return _bytes[_at++];
    };

    /**
     * Read 8 bits from the buffer.
     * @returns {Number} A signed integer in the range [-128, 127].
     */
    this.readByteSigned = () => {
        const x = _bytes[_at++];
        if (x < 128)
            return x;

        return -128 + (x & 0x7F);
    };

    /**
     * Read 16 bits from the buffer.
     * @returns {Number} An unsigned integer in the range [0, 65535].
     */
    this.readShort = () => {
        return (_bytes[_at++] << 8) | _bytes[_at++];
    };

    /**
     * Read 32 bits from the buffer.
     * @returns {Number} An unsigned integer in the range [0, 4294967295].
     */
    this.readInt = () => {
        return (_bytes[_at++] << 24) | (_bytes[_at++] << 16) | (_bytes[_at++] << 8) | _bytes[_at++];
    };

    /**
     * Read 32 bits from the buffer.
     * @returns {number} A floating point number.
     */
    this.readFloat = () => {
        const buffer = new ArrayBuffer(4);
        const intBuffer = new Int32Array(buffer);

        intBuffer[0] = this.readInt();

        return new Float32Array(buffer)[0];
    };

    /**
     * Read a string with unknown length from the buffer.
     * @returns {String} A UTF-16 string.
     */
    this.readString = () => {
        let string = "";
        const length = this.readShort();
        for (let idx = 0; idx < length; ++idx)
            string += String.fromCharCode(this.readShort());

        return string;
    };

    if (source)
        _bytes = Array.from(source);
    else
        _bytes = [];
}