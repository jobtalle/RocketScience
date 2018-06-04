import {Pcb} from "../pcb/pcb";
import * as Matter from "matter-js";

/**
 * An environment to place bots in.
 * @param {Object} myr A Myriad instance.
 * @param {Number} width The width in meters.
 * @constructor
 */
export function Terrain(myr, width) {
    const AIR_HEIGHT = 100;
    const WATER_DEPTH = 200;
    const COLOR_WATER_TOP = new myr.Color(0.3, 0.3, 1);
    const COLOR_WATER_BOTTOM = new myr.Color(1, 1, 1, 0);

    const _heights = new Array(width * Terrain.SEGMENTS_PER_METER + 1);

    /**
     * Make a physics body for this terrain.
     * @returns {Object} A matter-js physics body.
     */
    this.getBody = () => {
        const vertices = [];

        for (let i = 0; i < _heights.length; ++i)
            vertices.push(Matter.Vector.create(i * Terrain.PIXELS_PER_SEGMENT, _heights[i]));

        return Matter.Bodies.fromVertices(0, 0, [vertices],
            {
                isStatic: true
            });
    };

    /**
     * Returns the width in pixels.
     * @returns {Number} The width in pixels.
     */
    this.getWidth = () => width * Terrain.PIXELS_PER_METER;

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
            myr.primitives.drawLine(myr.Color.BLACK,
                (i * Terrain.PIXELS_PER_SEGMENT), _heights[i],
                (i + 1) * Terrain.PIXELS_PER_SEGMENT, _heights[i + 1]);

        myr.primitives.fillRectangleGradient(
            COLOR_WATER_TOP,
            COLOR_WATER_TOP,
            COLOR_WATER_BOTTOM,
            COLOR_WATER_BOTTOM,
            0, 0,
            this.getWidth(), WATER_DEPTH);
    };

    for (let i = 0; i < _heights.length; ++i)
        _heights[i] = Math.cos(i / 16) * 30;
}

Terrain.SEGMENTS_PER_METER = 2;
Terrain.POINTS_PER_METER = 8;
Terrain.PIXELS_PER_METER = Pcb.PIXELS_PER_POINT * Terrain.POINTS_PER_METER;
Terrain.PIXELS_PER_SEGMENT = Terrain.PIXELS_PER_METER / Terrain.SEGMENTS_PER_METER;