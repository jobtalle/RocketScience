import {Scale} from "../scale";
import Myr from "myr.js"

/**
 * An environment to place bots in.
 * @param {Myr} myr A Myriad instance.
 * @param {Object} recipe A valid recipe to generate terrain from.
 * @constructor
 */
export function Terrain(myr, recipe) {
    const WATER_DEPTH = 200;
    const COLOR_WATER_TOP = new Myr.Color(0.3, 0.3, 1, 0.2);
    const COLOR_WATER_BOTTOM = new Myr.Color(1, 1, 1, 0);

    const _heights = recipe.getHeights();

    const makeSurfaces = heights => {
        const surfaces = [];

        for (let section = 0; section < _heights.length - 1; section += Terrain.SECTIONS_PER_SURFACE) {
            const surface = new myr.Surface(Terrain.SURFACE_WIDTH, Terrain.SURFACE_HEIGHT);

            surface.bind();

            for (let i = 0; i <= Terrain.SECTIONS_PER_SURFACE; ++i) {
                if (section + i === _heights.length)
                    break;

                const xStart = i * Terrain.PIXELS_PER_SEGMENT;
                const xEnd = xStart + Terrain.PIXELS_PER_SEGMENT;
                const yStart = Terrain.SURFACE_HEIGHT + heights[section + i] * Scale.PIXELS_PER_METER;
                const yEnd = Terrain.SURFACE_HEIGHT + heights[section + i + 1] * Scale.PIXELS_PER_METER;

                myr.primitives.drawTriangle(Terrain.COLOR_FILL,
                    xStart, yStart,
                    xStart, Terrain.SURFACE_HEIGHT,
                    xEnd, Terrain.SURFACE_HEIGHT);
                myr.primitives.drawTriangle(Terrain.COLOR_FILL,
                    xEnd, Terrain.SURFACE_HEIGHT,
                    xEnd, yEnd,
                    xStart, yStart);
                myr.primitives.drawLine(Terrain.COLOR_EDGE, xStart, yStart, xEnd, yEnd);
            }

            surfaces.push(surface);
        }

        return surfaces;
    };

    const _surfaces = makeSurfaces(_heights);

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
        const first = Math.max(Math.floor(left / Terrain.SURFACE_WIDTH), 0);
        const last = Math.min(Math.ceil(right / Terrain.SURFACE_WIDTH), _surfaces.length);

        for (let surface = first; surface < last; ++surface)
            _surfaces[surface].draw(surface * Terrain.SURFACE_WIDTH, -Terrain.SURFACE_HEIGHT);

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
        for (const surface of _surfaces)
            surface.free();
    };
}

Terrain.SEGMENTS_PER_METER = 2;
Terrain.PIXELS_PER_SEGMENT = Scale.PIXELS_PER_METER / Terrain.SEGMENTS_PER_METER;
Terrain.METERS_PER_SEGMENT = 1 / Terrain.SEGMENTS_PER_METER;
Terrain.SECTIONS_PER_SURFACE = 8;
Terrain.MAX_HEIGHT = 8;
Terrain.SURFACE_WIDTH = Terrain.PIXELS_PER_SEGMENT * Terrain.SECTIONS_PER_SURFACE;
Terrain.SURFACE_HEIGHT = Scale.PIXELS_PER_METER * Terrain.MAX_HEIGHT;
Terrain.COLOR_EDGE = new Myr.Color(0.15, 0.15, 0.15);
Terrain.COLOR_FILL = new Myr.Color(0.4, 0.6, 0.3);