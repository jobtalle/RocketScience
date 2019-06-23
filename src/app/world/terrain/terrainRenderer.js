import {StyleUtils} from "../../utils/styleUtils";
import {TerrainSegment} from "./terrainSegment";
import {Scale} from "../scale";
import {Terrain} from "./terrain";

/**
 * A terrain renderer.
 * @param {Myr} myr A Myriad instance.
 * @param {Terrain} terrain A terrain to render.
 * @constructor
 */
export function TerrainRenderer(myr, terrain) {
    const WATER_DEPTH = 200;
    const COLOR_WATER_TOP = StyleUtils.getColor("--game-color-water-top");
    const COLOR_WATER_BOTTOM = StyleUtils.getColor("--game-color-water-bottom");

    const makeSegments = heights => {
        const segments = [];

        for (let section = 0; section < heights.length - 1; section += Terrain.SECTIONS_PER_SEGMENT)
            segments.push(new TerrainSegment(
                myr,
                Terrain.SEGMENT_WIDTH,
                Scale.PIXELS_PER_METER * Terrain.MAX_HEIGHT,
                Scale.PIXELS_PER_METER * Terrain.MAX_DEPTH,
                heights.slice(section, section + Terrain.SECTIONS_PER_SEGMENT + 1)));

        return segments;
    };

    const _segments = makeSegments(terrain.getHeights());

    /**
     * Draws the terrain.
     * @param {Number} left The left bound.
     * @param {Number} right The right bound.
     */
    this.draw = (left, right) => {
        const first = Math.max(Math.floor(left / Terrain.SEGMENT_WIDTH), 0);
        const last = Math.min(Math.ceil(right / Terrain.SEGMENT_WIDTH), _segments.length);

        for (let segment = first; segment < last; ++segment)
            _segments[segment].draw(segment * Terrain.SEGMENT_WIDTH, -Terrain.SEGMENT_ELEVATION);

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