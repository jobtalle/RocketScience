import {ByteBuffer} from "../../utils/byteBuffer";

/**
 * Wrapper for a Buffer, with specific
 * @param arrayBuffer
 * @constructor
 */
export function AseBuffer(arrayBuffer) {
    const _buffer = new ByteBuffer(new Uint8Array(arrayBuffer));
    let _colorDepth = 'RGBA';

    /**
     * Reads an unsigned 8bit int
     */
    this.readByte = () => _buffer.readByte();

    /**
     * Reads an unsigned 16bit int (LE)
     */
    this.readWord = () => _buffer.readShort();

    /**
     * Reads a signed 16bit int (LE)
     */
    this.readShort = () => _buffer.readShortSigned();

    /**
     * Reads an unsigned 32bit int (LE)
     */
    this.readDword = () => _buffer.readInt();

    /**
     * Reads a signed 32bit int.
     * @returns {*}
     */
    this.readLong = () => _buffer.readIntSigned();

    /**
     * Read a UTF-8 string.
     */
    this.readString = () => _buffer.readStringBytes();

    /**
     * Reads a fixed 32 bit float (16.16)
     */
    this.readFixed = () => _buffer.readFloat();

    /**
     * Reads a pixel based on current buffer color depth
     */
    this.readPixel = () => {
        const pixel = {};

        switch (_colorDepth) {
            case 'RGBA':
                pixel.r = this.readByte();
                pixel.g = this.readByte();
                pixel.b = this.readByte();
                pixel.a = this.readByte();
                break;
            case 'Grayscale':
                pixel.value = this.readByte();
                pixel.alpha = this.readByte();
                break;
            case 'Indexed':
                pixel.index = this.readByte();
                break;
        }

        return pixel;
    };

    /**
     * Skips the read position ahead
     * @param {number} count Bytes to skip
     */
    this.skipBytes = count => _buffer.skipBytes(count);

    this.getBytes = () => _buffer.getBytes();

    this.getColorDepth = () => _colorDepth;

    this.setColorDepth = colDepth => _colorDepth = colDepth;
}
