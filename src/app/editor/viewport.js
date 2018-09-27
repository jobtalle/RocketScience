/**
 * Information defining a viewport used by interfaces.
 * @param {Number} width The width in pixels.
 * @param {Number} split A number of pixels after which the view is split.
 * @param {HTMLElement} element An HTML element spanning the viewport to put HTML content on.
 * @constructor
 */
export function Viewport(width, split, element) {
    this.getSplitX = () => split;
    this.getElement = () => element;
}