import {Scale} from "../scale";

/**
 * An environment to place bots in.
 * @param {Object} generator A valid generator to generate terrain from.
 * @constructor
 */
export function Terrain(generator) {
    const _heights = generator.getHeights();

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
     * Get all height points of this terrain.
     * @returns {Array} An array of heights. Negative numbers elevate, positive numbers are below sea level.
     */
    this.getHeights = () => _heights;
}

Terrain.SEGMENTS_PER_METER = 2;
Terrain.PIXELS_PER_SEGMENT = Scale.PIXELS_PER_METER / Terrain.SEGMENTS_PER_METER;
Terrain.METERS_PER_SEGMENT = 1 / Terrain.SEGMENTS_PER_METER;
Terrain.SECTIONS_PER_SEGMENT = 8;
Terrain.SEGMENT_WIDTH = Terrain.PIXELS_PER_SEGMENT * Terrain.SECTIONS_PER_SEGMENT;
Terrain.MAX_HEIGHT = 8;
Terrain.MAX_DEPTH = 3;
Terrain.SEGMENT_ELEVATION = Scale.PIXELS_PER_METER * Terrain.MAX_HEIGHT;