/**
 * A water plane.
 * @param {Number} amplitude The maximum amplitude of this water surface in pixels.
 * @constructor
 */
export function Water(amplitude) {
    let _phase = 0;

    /**
     * Update the water.
     * @param {Number} timeStep The number of seconds passed since the last update.
     */
    this.update = timeStep => {
        _phase += timeStep * 2;
    };

    /**
     * Get the maximum wave amplitude in pixels.
     * @returns {Number} The maximum amplitude that can be reached, positive or negative.
     */
    this.getAmplitude = () => amplitude;

    /**
     * Sample the vertical displacement.
     * @param {Number} x The X location in pixels to sample at.
     * @returns {Number} The vertical displacement in pixels.
     */
    this.sample = x => {
        const left = this.sampleIndex(Math.floor(x / Water.INTERVAL));
        const f = (x - left * Water.INTERVAL) / Water.INTERVAL;

        return this.sampleIndex(left) + (this.sampleIndex(left + 1) - this.sampleIndex(left)) * f;
    };

    /**
     * Sample the vertical displacement at an anchor point index.
     * @param {Number} i The index to sample at. Indices are separated by Water.INTERVAL pixels.
     * @returns {Number} The vertical displacement in pixels.
     */
    this.sampleIndex = i => {
        return Math.cos(i * Water.INTERVAL * 0.07 + _phase) * amplitude * Math.sin(_phase);
    };
}

Water.INTERVAL = 16;