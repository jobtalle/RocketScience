/**
 * An HTML based parts library.
 * @param {Object} editor A PcbEditor which places selected objects.
 * @param {Number} width The width of the library in pixels.
 * @constructor
 */
export function Library(editor, width) {
    /**
     * Gets the width of the library.
     * @returns {Number} The width in pixels.
     */
    this.getWidth = () => width;
}