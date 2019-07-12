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
     * @param {Array} heights An array of all relevant heights for this segment from left to right.
     * @param {Number} width The width in pixels.
     * @param {Number} height The height in pixels.
     * @param {Number} depth The water depth in pixels.
     * @param {Number} offset The X offset of this segment in pixels.
     */
    this.draw = (heights, width, height, depth, offset) => {
        const pixelsPerSegment = width / (heights.length - 1);
        const cFill = StyleUtils.getColor("--game-color-terrain-fields-fill");
        const cEdge = StyleUtils.getColor("--game-color-terrain-fields-border");

        for (let i = 0; i < heights.length - 1; ++i) {
            const xStart = i * pixelsPerSegment;
            const xEnd = xStart + pixelsPerSegment;
            const yStart = height + heights[i] * Scale.PIXELS_PER_METER;
            const yEnd = height + heights[i + 1] * Scale.PIXELS_PER_METER;

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