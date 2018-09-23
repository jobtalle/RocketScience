/**
 * Information defining a viewport used by interfaces.
 * @param {Number} width The width in pixels.
 * @param {Number} split A factor to split the viewport at.
 * @param {HTMLElement} element An HTML element spanning the viewport to put HTML content on.
 * @constructor
 */
export function Viewport(width, split, element) {
    const _splitX = Math.floor(width * split);

    this.getSplitX = () => _splitX;
    this.getElement = () => element;
}