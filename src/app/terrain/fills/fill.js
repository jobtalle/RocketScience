import {Scale} from "../../world/scale";
import {Profiles} from "../profiles";

/**
 * A terrain filler, that paints the terrain.
 * @param {RenderContext} renderContext A render context.
 * @param {Terrain} terrain A terrain to scatter on.
 * @constructor
 */
export function Fill(renderContext, terrain) {
    const _filler = Profiles.fills[terrain.getProfile()];

    /**
     * Fill a section of terrain.
     * @param {Array} heights An array of all relevant heights for this section from left to right.
     * @param {Number} width The width in pixels.
     * @param {Number} height The height in pixels.
     * @param {Number} depth The water depth in pixels.
     * @param {Number} offset The X offset of this segment in pixels.
     */
    this.draw = (heights, width, height, depth, offset) => {
        const pixelsPerSegment = width / (heights.length - 1);
        let xRight = 0;
        let xLeft = 0;
        let yRight = height + heights[0] * Scale.PIXELS_PER_METER;
        let yLeft = 0;

        _filler.prime(renderContext);

        for (let i = 0; i < heights.length - 1; ++i) {
            xLeft = xRight;
            yLeft = yRight;
            xRight = xLeft + pixelsPerSegment;
            yRight = height + heights[i + 1] * Scale.PIXELS_PER_METER;

            _filler.drawSegment(
                renderContext.getMyr(),
                xLeft,
                yLeft,
                xRight,
                yRight,
                offset,
                height + depth);
        }

        renderContext.getMyr().flush();
        _filler.free();
    };
}