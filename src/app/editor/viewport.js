/**
 * Information defining a viewport used by interfaces.
 * @param {Number} width The width in pixels.
 * @param {Number} height The height in pixels.
 * @param {Number} split A factor to split the viewport at.
 * @param {HTMLElement} element An HTML element spanning the viewport to put HTML content on.
 * @constructor
 */
export function Viewport(width, height, split, element) {
    const _splitX = Math.floor(width * split);

    this.getWidth = () => width;
    this.getHeight = () => height;
    this.getSplitX = () => _splitX;
    this.getElement = () => element;
}