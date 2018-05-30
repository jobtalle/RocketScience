/**
 * An environment to place bots in.
 * @param {Number} width The width in meters.
 * @constructor
 */
export function Terrain(myr, width) {
    const _heights = new Array(width * Terrain.SEGMENTS_PER_METER);

    /**
     * Draws the terrain.
     */
    this.draw = () => {
        for (let i = 0; i < _heights.length - 1; ++i)
            myr.primitives.drawLine(myr.Color.BLACK, i, _heights[i], i + 1, _heights[i + 1]);
    };

    for (let i = 0; i < _heights.length; ++i)
        _heights[i] = Math.cos(i / 16) * 30;
}

Terrain.SEGMENTS_PER_METER = 2;