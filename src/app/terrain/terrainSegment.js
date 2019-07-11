import Myr from "../../../node_modules/myr.js/myr";
import {Scale} from "../world/scale";
import {StyleUtils} from "../utils/styleUtils";
import {Terrain} from "./terrain";

/**
 * A renderable terrain segment.
 * @param {Myr} myr A Myriad instance.
 * @param {Number} width The width in pixels.
 * @param {Number} height The height in pixels.
 * @param {Number} depth The water depth in pixels.
 * @param {Array} heights An array of all relevant heights for this segment from left to right.
 * @param {Array} scatters An array of Scatters.SpriteEntry instances.
 * @param {Number} offset The X offset of this segment in pixels.
 * @constructor
 */
export function TerrainSegment(myr, width, height, depth, heights, scatters, offset) {
    const _surface = new myr.Surface(width, height + depth);

    const update = () => {
        const pixelsPerSegment = width / (heights.length - 1);

        _surface.bind();

        for (let i = 0; i < heights.length - 1; ++i) {
            const xStart = i * pixelsPerSegment;
            const xEnd = xStart + pixelsPerSegment;
            const yStart = height + heights[i] * Scale.PIXELS_PER_METER;
            const yEnd = height + heights[i + 1] * Scale.PIXELS_PER_METER;

            myr.primitives.drawTriangle(TerrainSegment.COLOR_FILL,
                xStart, yStart,
                xStart, height + depth,
                xEnd, height + depth);
            myr.primitives.drawTriangle(TerrainSegment.COLOR_FILL,
                xEnd, height + depth,
                xEnd, yEnd,
                xStart, yStart);
            myr.primitives.drawLine(TerrainSegment.COLOR_EDGE,
                xStart,
                yStart,
                xEnd,
                yEnd);
        }

        for (const scatter of scatters) {
            scatter.sprite.setFrame(scatter.frame);
            scatter.sprite.draw(
                scatter.x - offset,
                Terrain.MAX_HEIGHT * Scale.PIXELS_PER_METER + TerrainSegment.SCATTER_SHIFT + scatter.y);
        }
    };

    /**
     * Draw this segment.
     * @param {Number} x The X position in pixels.
     * @param {Number} y The Y position in pixels.
     */
    this.draw = (x, y) => _surface.draw(x, y);

    /**
     * Free all resources occupied by this terrain segment.
     */
    this.free = () => {
        _surface.free();
    };

    update();
}

TerrainSegment.COLOR_EDGE = StyleUtils.getColor("--game-color-terrain-fields-border");
TerrainSegment.COLOR_FILL = StyleUtils.getColor("--game-color-terrain-fields-fill");
TerrainSegment.SCATTER_SHIFT = 1;