import {makeOctaves} from "./octaves";
import {cubicNoiseConfig, cubicNoiseSample1} from "./cubicNoise";

/**
 * A 2D fractal simplex noise with octaves.
 * @param {Number} seed A seed in the range [0, 1].
 * @param {Number} scale A scale parameter to multiply the input value with.
 * @param {Number} octaves The number of octaves.
 * @constructor
 */
export function FractalNoise(seed, scale, octaves) {
    const _octaves = makeOctaves(octaves, 2);
    const _noise = cubicNoiseConfig(seed);

    /**
     * Sample this noise at value x.
     * @param {Number} x The value to sample this noise at.
     * @returns {Number} A value in the range [-1, 1].
     */
    this.sample = x => {
        let result = 0;

        for (const octave of _octaves)
            result += octave * cubicNoiseSample1(_noise, x * scale);

        return result;
    };
}