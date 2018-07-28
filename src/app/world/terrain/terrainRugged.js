import noisejs from "noisejs"

/**
 * A recipe for rough unvaried terrain.
 * @Param {Number} seed The seed in the range [0, 2pi].
 * @param {Number} width The width in meters.
 * @constructor
 */
import {Terrain} from "./terrain";
import {makeOctaves} from "./octaves";

export function TerrainRugged(seed, width) {
    this.getHeights = () => {
        const segments = Math.ceil(width * Terrain.SEGMENTS_PER_METER) + 1;
        const heights = [];
        const sampleDirection = Math.PI * 2 * seed;
        const sampleX = Math.cos(sampleDirection);
        const sampleY = Math.sin(sampleDirection);
        const octaves = makeOctaves(TerrainRugged.OCTAVES, TerrainRugged.FALLOFF);

        for (let i = 0; i < segments; ++i)
            heights.push(0);

        let scale = TerrainRugged.SCALE;

        for (const octave of octaves) {
            const noise = new noisejs.Noise(seed++);

            for (let i = 0; i < segments; ++i) {
                const sampleAt = i * Terrain.METERS_PER_SEGMENT;

                heights[i] += noise.simplex2(
                    (sampleX * sampleAt) / scale,
                    (sampleY * sampleAt) / scale) * octave;
            }

            scale /= TerrainRugged.FALLOFF;
        }

        return heights;
    }
}

TerrainRugged.OCTAVES = 3;
TerrainRugged.SCALE = 14;
TerrainRugged.FALLOFF = 2;