import Myr from "../../../lib/myr";
import {Scale} from "../scale";

/**
 * An environment to place bots in.
 * @param {Myr} myr A Myriad instance.
 * @param {Object} recipe A valid recipe to generate terrain from.
 * @constructor
 */
export function Terrain(myr, recipe) {
    const AIR_HEIGHT = 100;
    const WATER_DEPTH = 200;
    const COLOR_WATER_TOP = new Myr.Color(0.3, 0.3, 1, 0.2);
    const COLOR_WATER_BOTTOM = new Myr.Color(1, 1, 1, 0);

    const _heights = recipe.getHeights();

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
     * Returns the height in pixels.
     * @returns {Number} The height in pixels.
     */
    this.getHeight = () => AIR_HEIGHT;

    /**
     * Draws the terrain.
     */
    this.draw = () => {
        for (let i = 0; i < _heights.length - 1; ++i)
            myr.primitives.drawLine(Myr.Color.BLACK,
                i * Terrain.PIXELS_PER_SEGMENT, _heights[i] * Scale.PIXELS_PER_METER,
                (i + 1) * Terrain.PIXELS_PER_SEGMENT, _heights[i + 1] * Scale.PIXELS_PER_METER);

        myr.primitives.fillRectangleGradient(
            COLOR_WATER_TOP,
            COLOR_WATER_TOP,
            COLOR_WATER_BOTTOM,
            COLOR_WATER_BOTTOM,
            0, 0,
            this.getWidth(), WATER_DEPTH);
    };
}

Terrain.SEGMENTS_PER_METER = 2;
Terrain.PIXELS_PER_SEGMENT = Scale.PIXELS_PER_METER / Terrain.SEGMENTS_PER_METER;
Terrain.METERS_PER_SEGMENT = 1 / Terrain.SEGMENTS_PER_METER;