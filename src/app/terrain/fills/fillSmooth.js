import {StyleUtils} from "../../utils/styleUtils";

/**
 * A smooth terrain fill.
 * @param {Myr.Color} border A border color.
 * @param {Array} entries An array of Entry objects, in threshold ascending order.
 * @constructor
 */
export function FillSmooth(border, entries) {
    /**
     * Prime this filler for sampling.
     * @param {RenderContext} renderContext A render context.
     */
    this.prime = renderContext => {

    };

    /**
     * Draw a segment of terrain.
     * @param {Myr} myr A Myriad instance.
     * @param {Number} xLeft The left x.
     * @param {Number} yLeft The left y.
     * @param {Number} xRight The right x.
     * @param {Number} yRight The right y.
     * @param {Number} offset The X offset in pixels.
     * @param {Number} bottom The number of pixels until the bottom of the section.
     */
    this.drawSegment = (myr, xLeft, yLeft, xRight, yRight, offset, bottom) => {
        const cFill = StyleUtils.getColor("--game-color-terrain-fields-fill");
        const cEdge = StyleUtils.getColor("--game-color-terrain-fields-border");

        myr.primitives.drawTriangle(cFill,
            xLeft, yLeft,
            xLeft, bottom,
            xRight, bottom);
        myr.primitives.drawTriangle(cFill,
            xRight, bottom,
            xRight, yRight,
            xLeft, yLeft);
        myr.primitives.drawLine(cEdge,
            xLeft,
            yLeft,
            xRight,
            yRight);
    };

    /**
     * Free this fillers resources. Always call this after priming.
     */
    this.free = () => {

    };
}

FillSmooth.Entry = function(color, threshold) {
    this.color = color;
    this.threshold = threshold;
};