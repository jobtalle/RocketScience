import {StyleUtils} from "../utils/styleUtils";
import {TerrainSegment} from "./terrainSegment";
import {Scale} from "../world/scale";
import {Terrain} from "./terrain";

/**
 * A terrain renderer.
 * @param {Myr} myr A Myriad instance.
 * @param {Terrain} terrain A terrain to render.
 * @param {Scatters} scatters Scatters to render to the terrain.
 * @constructor
 */
export function TerrainRenderer(myr, terrain, scatters) {
    const WATER_DEPTH = 200;
    const COLOR_WATER_TOP = StyleUtils.getColor("--game-color-water-top");
    const COLOR_WATER_BOTTOM = StyleUtils.getColor("--game-color-water-bottom");

    const makeSegments = heights => {
        const segments = [];

        for (let section = 0; section < heights.length - 1; section += Terrain.SEGMENTS_PER_SECTION) {
            const sprites = [];

            for (const sprite of scatters.getSprites()) {
                const shifted = sprite.copy();

                shifted.x -= section * Terrain.PIXELS_PER_SEGMENT;

                sprites.push(shifted);
            }

            segments.push(new TerrainSegment(
                myr,
                Terrain.SECTION_WIDTH,
                Scale.PIXELS_PER_METER * Terrain.MAX_HEIGHT,
                Scale.PIXELS_PER_METER * Terrain.MAX_DEPTH,
                heights.slice(section, section + Terrain.SEGMENTS_PER_SECTION + 1),
                sprites));
        }

        return segments;
    };

    const _segments = makeSegments(terrain.getHeights());

    /**
     * Draws the terrain.
     * @param {Number} left The left bound.
     * @param {Number} right The right bound.
     */
    this.draw = (left, right) => {
        const first = Math.max(Math.floor(left / Terrain.SECTION_WIDTH), 0);
        const last = Math.min(Math.ceil(right / Terrain.SECTION_WIDTH), _segments.length);

        for (let segment = first; segment < last; ++segment)
            _segments[segment].draw(segment * Terrain.SECTION_WIDTH, -Terrain.SEGMENT_ELEVATION);

        myr.primitives.fillRectangleGradient(
            COLOR_WATER_TOP,
            COLOR_WATER_TOP,
            COLOR_WATER_BOTTOM,
            COLOR_WATER_BOTTOM,
            0, 0,
            terrain.getWidth(), WATER_DEPTH);
    };

    /**
     * Free this terrain renderer.
     */
    this.free = () => {
        for (const segment of _segments)
            segment.free();
    };
}