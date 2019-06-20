import {Scale} from "../scale";
import {TerrainSegment} from "./terrainSegment";
import Myr from "myr.js"
import {StyleUtils} from "../../utils/styleUtils";

/**
 * An environment to place bots in.
 * @param {Myr} myr A Myriad instance.
 * @param {Object} generator A valid generator to generate terrain from.
 * @constructor
 */
export function Terrain(myr, generator) {
    const WATER_DEPTH = 200;
    const COLOR_WATER_TOP = StyleUtils.getColor("--game-color-water-top");
    const COLOR_WATER_BOTTOM = StyleUtils.getColor("--game-color-water-bottom");

    const _heights = generator.getHeights();

    const makeSegments = heights => {
        const segments = [];

        for (let section = 0; section < _heights.length - 1; section += Terrain.SECTIONS_PER_SEGMENT)
            segments.push(new TerrainSegment(
                myr,
                Terrain.SEGMENT_WIDTH,
                Scale.PIXELS_PER_METER * Terrain.MAX_HEIGHT,
                Scale.PIXELS_PER_METER * Terrain.MAX_DEPTH,
                heights.slice(section, section + Terrain.SECTIONS_PER_SEGMENT + 1)));

        return segments;
    };

    const _segments = makeSegments(_heights);

    /**
     * Make a physics body for this terrain.
     * @param {Physics} physics A physics instance.
     */
    this.makeTerrain = physics => {
        physics.setTerrain(_heights, 1 / Terrain.SEGMENTS_PER_METER);
    };

    /**
     * Returns the width in pixels.
     * @returns {Number} The width in pixels.
     */
    this.getWidth = () => (_heights.length - 1) * Terrain.PIXELS_PER_SEGMENT;

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
            this.getWidth(), WATER_DEPTH);
    };

    /**
     * Free this terrain.
     */
    this.free = () => {
        for (const segment of _segments)
            segment.free();
    };
}

Terrain.SEGMENTS_PER_METER = 2;
Terrain.PIXELS_PER_SEGMENT = Scale.PIXELS_PER_METER / Terrain.SEGMENTS_PER_METER;
Terrain.METERS_PER_SEGMENT = 1 / Terrain.SEGMENTS_PER_METER;
Terrain.SECTIONS_PER_SEGMENT = 8;
Terrain.SEGMENT_WIDTH = Terrain.PIXELS_PER_SEGMENT * Terrain.SECTIONS_PER_SEGMENT;
Terrain.MAX_HEIGHT = 8;
Terrain.MAX_DEPTH = 3;
Terrain.SEGMENT_ELEVATION = Scale.PIXELS_PER_METER * Terrain.MAX_HEIGHT;