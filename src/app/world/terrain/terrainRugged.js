import noisejs from "noisejs"

/**
 * A recipe for rough unvaried terrain.
 * @Param {Number} seed The seed in the range [0, 2pi].
 * @param {Number} width The width in meters.
 * @constructor
 */
import {Terrain} from "./terrain";

export function TerrainRugged(seed, width) {
    this.getHeights = () => {
        const segments = Math.ceil(width * Terrain.SEGMENTS_PER_METER) + 1;
        const heights = [];
        const noise = new noisejs.Noise(seed);

        for (let i = 0; i < segments; ++i) {
            heights.push(noise.simplex2(i * Terrain.METERS_PER_SEGMENT * 0.4, 0));
        }

        return heights;
    }
}