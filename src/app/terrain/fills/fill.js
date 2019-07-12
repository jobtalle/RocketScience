import {Scale} from "../../world/scale";
import {StyleUtils} from "../../utils/styleUtils";

/**
 * A terrain filler, that paints the terrain.
 * @param {RenderContext} renderContext A render context.
 * @param {Terrain} terrain A terrain to scatter on.
 * @constructor
 */
export function Fill(renderContext, terrain) {
    /**
     * Fill a segment of terrain.
     * @param {Array} heights An array of all relevant heights for this section from left to right.
     * @param {Number} width The width in pixels.
     * @param {Number} height The height in pixels.
     * @param {Number} depth The water depth in pixels.
     * @param {Number} offset The X offset of this segment in pixels.
     */
    this.draw = (heights, width, height, depth, offset) => {
        const pixelsPerSegment = width / (heights.length - 1);
        const cFill = StyleUtils.getColor("--game-color-terrain-fields-fill");
        const cEdge = StyleUtils.getColor("--game-color-terrain-fields-border");

        let xEnd = 0;
        let xStart = 0;
        let yEnd = height + heights[0] * Scale.PIXELS_PER_METER;
        let yStart = 0;

        for (let i = 0; i < heights.length - 1; ++i) {
            xStart = xEnd;
            yStart = yEnd;
            xEnd = xStart + pixelsPerSegment;
            yEnd = height + heights[i + 1] * Scale.PIXELS_PER_METER;

            renderContext.getMyr().primitives.drawTriangle(cFill,
                xStart, yStart,
                xStart, height + depth,
                xEnd, height + depth);
            renderContext.getMyr().primitives.drawTriangle(cFill,
                xEnd, height + depth,
                xEnd, yEnd,
                xStart, yStart);
            renderContext.getMyr().primitives.drawLine(cEdge,
                xStart,
                yStart,
                xEnd,
                yEnd);
        }
    };
}