import {Pcb} from "../pcb/pcb";

/**
 * An environment to place bots in.
 * @param {Object} myr A Myriad instance.
 * @param {Number} width The width in meters.
 * @constructor
 */
export function Terrain(myr, width) {
    const _heights = new Array(width * Terrain.SEGMENTS_PER_METER);

    /**
     * Returns the width in pixels.
     * @returns {Number} The width in pixels.
     */
    this.getWidth = () => width * Terrain.PIXELS_PER_METER;

    /**
     * Draws the terrain.
     */
    this.draw = () => {
        for (let i = 0; i < _heights.length - 1; ++i)
            myr.primitives.drawLine(myr.Color.BLACK,
                (i * Terrain.PIXELS_PER_SEGMENT), _heights[i],
                (i + 1) * Terrain.PIXELS_PER_SEGMENT, _heights[i + 1]);
    };

    for (let i = 0; i < _heights.length; ++i)
        _heights[i] = Math.cos(i / 16) * 30;
}

Terrain.SEGMENTS_PER_METER = 2;
Terrain.POINTS_PER_METER = 8;
Terrain.PIXELS_PER_METER = Pcb.PIXELS_PER_POINT * Terrain.POINTS_PER_METER;
Terrain.PIXELS_PER_SEGMENT = Terrain.PIXELS_PER_METER / Terrain.SEGMENTS_PER_METER;