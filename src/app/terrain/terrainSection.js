import Myr from "../../../node_modules/myr.js/myr";
import {Scale} from "../world/scale";
import {Terrain} from "./terrain";

/**
 * A renderable terrain section.
 * @param {Myr} myr A Myriad instance.
 * @param {Number} width The width in pixels.
 * @param {Number} height The height in pixels.
 * @param {Number} depth The water depth in pixels.
 * @param {Array} heights An array of all relevant heights for this segment from left to right.
 * @param {Array} scatters An array of Scatters.SpriteEntry instances.
 * @param {Fill} fill A terrain filler.
 * @param {Number} offset The X offset of this segment in pixels.
 * @constructor
 */
export function TerrainSection(myr, width, height, depth, heights, scatters, fill, offset) {
    const _surface = new myr.Surface(width, height + depth);

    const update = () => {
        _surface.bind();

        fill.draw(heights, width, height, depth, offset);

        for (const scatter of scatters) {
            scatter.sprite.setFrame(scatter.frame);
            scatter.sprite.draw(
                scatter.x - offset,
                Terrain.MAX_HEIGHT * Scale.PIXELS_PER_METER + TerrainSection.SCATTER_SHIFT + scatter.y);
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

TerrainSection.SCATTER_SHIFT = 1;