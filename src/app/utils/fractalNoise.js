import {makeOctaves} from "./octaves";
import noisejs from "noisejs"
import Myr from "myr.js";

/**
 * A 2D fractal simplex noise with octaves.
 * @param {Number} seed A seed in the range [0, 1].
 * @param {Number} scale A scale parameter to multiply the input value with.
 * @param {Number} octaves The number of octaves.
 * @constructor
 */
export function FractalNoise(seed, scale, octaves) {
    const _octaves = makeOctaves(octaves, 2);
    const _noise = new noisejs.Noise(seed);
    const _origin = new Myr.Vector(Math.random(), Math.random());
    const _direction = Math.random() * Math.PI * 2;
    const _directionVector = new Myr.Vector(Math.cos(_direction), Math.sin(_direction));

    /**
     * Sample this noise at value x.
     * @param {Number} x The value to sample this noise at.
     * @returns {Number} A value in the range [-1, 1].
     */
    this.sample = x => {
        let result = 0;

        for (const octave of _octaves)
            result += octave * _noise.simplex2(
                _origin.x + _directionVector.x * x * scale,
                _origin.y + _directionVector.y * x * scale);

        return result;
    };
}