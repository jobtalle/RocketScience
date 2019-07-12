/**
 * A smooth terrain fill.
 * @param {Myr.Color} border A border color.
 * @param {Myr.Color} background A background color.
 * @param {Array} entries An array of Entry objects, in thickness descending order.
 * @constructor
 */
export function FillSmooth(border, background, entries) {
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
        myr.primitives.drawTriangle(
            background,
            xLeft, yLeft,
            xLeft, bottom,
            xRight, bottom);
        myr.primitives.drawTriangle(
            background,
            xRight, bottom,
            xRight, yRight,
            xLeft, yLeft);

        for (const entry of entries) {
            const bottomLeft = yLeft + entry.thickness;
            const bottomRight = yRight + entry.thickness;

            myr.primitives.drawTriangle(
                entry.color,
                xLeft, yLeft,
                xLeft, bottomLeft,
                xRight, bottomRight);
            myr.primitives.drawTriangle(
                entry.color,
                xRight, bottomRight,
                xRight, yRight,
                xLeft, yLeft);
        }

        myr.primitives.drawLine(
            border,
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

FillSmooth.Entry = function(color, thickness) {
    this.color = color;
    this.thickness = thickness;
};