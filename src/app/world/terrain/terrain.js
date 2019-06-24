import {Scale} from "../scale";

/**
 * An environment to place bots in.
 * @param {Array} heights An array of heights. Negative numbers elevate, positive numbers are below sea level.
 * @constructor
 */
export function Terrain(heights) {
    /**
     * Make a physics body for this terrain.
     * @param {Physics} physics A physics instance.
     */
    this.makeTerrain = physics => {
        physics.setTerrain(heights, 1 / Terrain.SEGMENTS_PER_METER);
    };

    /**
     * Returns the width in pixels.
     * @returns {Number} The width in pixels.
     */
    this.getWidth = () => (heights.length - 1) * Terrain.PIXELS_PER_SEGMENT;

    /**
     * Get all height points of this terrain.
     * @returns {Array} An array of heights. Negative numbers elevate, positive numbers are below sea level.
     */
    this.getHeights = () => heights;

    /**
     * Serialize this terrain.
     * @param {ByteBuffer} buffer A byte buffer.
     */
    this.serialize = buffer => {
        buffer.writeShort(heights.length - 1);

        for (const height of heights)
            buffer.writeFloat(height);
    };
}

/**
 * Deserialize a terrain.
 * @param {ByteBuffer} buffer A byte buffer.
 * @returns {Terrain} The deserialized terrain.
 */
Terrain.deserialize = buffer => {
    const heights = new Array(buffer.readShort() + 1);

    for (let i = 0; i < heights.length; ++i)
        heights[i] = buffer.readFloat();

    return new Terrain(heights);
};

Terrain.SEGMENTS_PER_METER = 2;
Terrain.PIXELS_PER_SEGMENT = Scale.PIXELS_PER_METER / Terrain.SEGMENTS_PER_METER;
Terrain.METERS_PER_SEGMENT = 1 / Terrain.SEGMENTS_PER_METER;
Terrain.SEGMENTS_PER_SECTION = 8;
Terrain.SEGMENT_WIDTH = Terrain.PIXELS_PER_SEGMENT * Terrain.SEGMENTS_PER_SECTION;
Terrain.MAX_HEIGHT = 8;
Terrain.MAX_DEPTH = 3;
Terrain.SEGMENT_ELEVATION = Scale.PIXELS_PER_METER * Terrain.MAX_HEIGHT;