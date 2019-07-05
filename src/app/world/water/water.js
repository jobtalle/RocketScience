import {makeOctaves} from "../../utils/octaves";

/**
 * A water plane.
 * @param {Number} amplitude The maximum amplitude of this water surface in pixels.
 * @constructor
 */
export function Water(amplitude) {
    const _octaves = makeOctaves(Water.WAVE_FUNCTION_PHASES, Water.WAVE_FUNCTION_FALLOFF);
    let _phase = 0;

    /**
     * Update the water.
     * @param {Number} timeStep The number of seconds passed since the last update.
     */
    this.update = timeStep => {
        _phase += timeStep * Water.SPEED;

        if (_phase > Water.WAVE_PHASE_LIMIT)
            _phase -= Water.WAVE_PHASE_LIMIT;
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
     * Sample the derivative.
     * @param {Number} x The X location in pixels to sample at.
     * @returns {Number} The derivative of the waves at this point.
     */
    this.sampleDerivative = x => {
        const left = this.sampleIndex(Math.floor(x / Water.INTERVAL));
        const f = (x - left * Water.INTERVAL) / Water.INTERVAL;

        return this.sampleDerivativeIndex(left) + (this.sampleDerivativeIndex(left + 1) - this.sampleDerivativeIndex(left)) * f;
    };

    /**
     * Sample the vertical displacement at an anchor point index.
     * @param {Number} i The index to sample at. Indices are separated by Water.INTERVAL pixels.
     * @returns {Number} The vertical displacement in pixels.
     */
    this.sampleIndex = i => {
        const index = i * Water.SCALE * Water.INTERVAL;
        const phase = _phase * Math.PI * 2;

        return (
            _octaves[0] * Math.cos(index * Water.WAVE_INDEX_SCALE_A - phase * Water.WAVE_SCALE_A) +
            _octaves[1] * Math.cos(index * Water.WAVE_INDEX_SCALE_B - phase * Water.WAVE_SCALE_B) +
            _octaves[2] * Math.cos(index * Water.WAVE_INDEX_SCALE_C - phase * Water.WAVE_SCALE_C)
        ) * amplitude;
    };

    /**
     * Sample the slope at an anchor point index.
     * @param {Number} i The index to sample at. Indices are separated by Water.INTERVAL pixels.
     * @returns {Number} The derivative of the waves at this point.
     */
    this.sampleDerivativeIndex = i => {
        const index = i * Water.SCALE * Water.INTERVAL;
        const phase = _phase * Math.PI * 2;

        return (
            _octaves[0] * Water.WAVE_SCALE_A * Math.sin(index * Water.WAVE_INDEX_SCALE_A - phase * Water.WAVE_SCALE_A) +
            _octaves[1] * Water.WAVE_SCALE_B * Math.sin(index * Water.WAVE_INDEX_SCALE_B - phase * Water.WAVE_SCALE_B) +
            _octaves[2] * Water.WAVE_SCALE_C * Math.sin(index * Water.WAVE_INDEX_SCALE_C - phase * Water.WAVE_SCALE_C)
        ) * -amplitude / Water.INTERVAL;
    };
}

Water.WAVE_FUNCTION_PHASES = 3;
Water.WAVE_FUNCTION_FALLOFF = 1.4;
Water.WAVE_SCALE_A = 1;
Water.WAVE_SCALE_B = 1.41;
Water.WAVE_SCALE_C = -0.31;
Water.WAVE_INDEX_SCALE_A = 0.8;
Water.WAVE_INDEX_SCALE_B = 1.31;
Water.WAVE_INDEX_SCALE_C = 1.41;
Water.WAVE_PHASE_LIMIT = 100;
Water.INTERVAL = 16;
Water.SCALE = 0.08;
Water.SPEED = 1.5;