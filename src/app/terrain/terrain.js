import {Scale} from "../world/scale";

/**
 * An environment to place bots in.
 * @param {Array} heights An array of heights. Negative numbers elevate, positive numbers are below sea level.
 * @param {Number} profile A valid graphics profile ID.
 * @constructor
 */
export function Terrain(heights, profile) {
    let _edited = false;

    /**
     * Make a physics body for this terrain.
     * @param {Physics} physics A physics instance.
     */
    this.makeTerrain = physics => {
        physics.setTerrain(heights, Terrain.METERS_PER_SEGMENT);
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
     * Get the graphics profile.
     * @returns {Number} The ID of the graphics profile.
     */
    this.getProfile = () => profile;

    /**
     * Get the height of this terrain at a certain x position within the terrain.
     * @param {Number} x The X position in meters.
     * @returns {Number} The elevation in meters.
     */
    this.getHeight = x => {
        if (x < 0)
            return heights[0];

        const left = Math.floor(x / Terrain.METERS_PER_SEGMENT);

        if (left >= heights.length - 1)
            return heights[heights.length - 1];

        const f = (x - left * Terrain.METERS_PER_SEGMENT) / Terrain.METERS_PER_SEGMENT;

        return heights[left] + (heights[left + 1] - heights[left]) * f;
    };

    /**
     * Get the slope of this terrain at a certain x position within the terrain.
     * @param {Number} x The X position in meters.
     * @returns {Number} The slope.
     */
    this.getSlope = x => {
        if (x < 0)
            return 0;

        const left = Math.floor(x / Terrain.METERS_PER_SEGMENT);

        if (left >= heights.length - 1)
            return 0;

        return (heights[left + 1] - heights[left]) / Terrain.METERS_PER_SEGMENT;
    };

    /**
     * Set the height points of this terrain.
     * @param {Array} newHeights The new height points.
     */
    this.setHeights = newHeights => {
        heights = newHeights;

        _edited = true;
    };

    /**
     * Set the graphics profile.
     * @param {Number} newProfile A valid graphics profile.
     */
    this.setProfile = newProfile => {
        profile = newProfile;

        _edited = true;
    };

    /**
     * Check whether the terrain has been edited.
     * @returns {Boolean} A boolean indicating whether the terrain has been edited.
     */
    this.isEdited = () => _edited;

    /**
     * Serialize this terrain.
     * @param {ByteBuffer} buffer A byte buffer.
     */
    this.serialize = buffer => {
        buffer.writeByte(profile);
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
    const profile = buffer.readByte();
    const heights = new Array(buffer.readShort() + 1);

    for (let i = 0; i < heights.length; ++i)
        heights[i] = buffer.readFloat();

    return new Terrain(heights, profile);
};

Terrain.SEGMENTS_PER_METER = 2;
Terrain.PIXELS_PER_SEGMENT = Scale.PIXELS_PER_METER / Terrain.SEGMENTS_PER_METER;
Terrain.METERS_PER_SEGMENT = 1 / Terrain.SEGMENTS_PER_METER;
Terrain.SEGMENTS_PER_SECTION = 8;
Terrain.SECTION_WIDTH = Terrain.PIXELS_PER_SEGMENT * Terrain.SEGMENTS_PER_SECTION;
Terrain.MAX_HEIGHT = 8;
Terrain.MAX_DEPTH = 3;
Terrain.SEGMENT_ELEVATION = Scale.PIXELS_PER_METER * Terrain.MAX_HEIGHT;