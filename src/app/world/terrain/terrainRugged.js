import noisejs from "noisejs"

/**
 * A recipe for rough unvaried terrain.
 * @param {Number} seed The seed in the range [0, 1].
 * @param {Number} width The width in meters.
 * @param {Number} roughness The roughness of this terrain in the range [0, 1].
 * @param {Number} height The height of this terrain in the range [0, 1].
 * @constructor
 */
import {Terrain} from "./terrain";
import {makeOctaves} from "./octaves";

export function TerrainRugged(seed, width, roughness, height) {
    this.getHeights = () => {
        const segments = Math.ceil(width * Terrain.SEGMENTS_PER_METER) + 1;
        const heights = [];
        const sampleDirection = Math.PI * 2 * seed;
        const sampleX = Math.cos(sampleDirection);
        const sampleY = Math.sin(sampleDirection);
        const octaves = makeOctaves(TerrainRugged.OCTAVES, TerrainRugged.FALLOFF);
        const amp = TerrainRugged.AMP_MIN + (TerrainRugged.AMP_MAX - TerrainRugged.AMP_MIN) * height;
        const heightMultiplier = amp * (TerrainRugged.HEIGHT_MAX - TerrainRugged.HEIGHT_MIN);

        for (let i = 0; i < segments; ++i)
            heights.push(0);

        let scale = TerrainRugged.SCALE_MIN + (TerrainRugged.SCALE_MAX - TerrainRugged.SCALE_MIN) * (1 - roughness);

        for (const octave of octaves) {
            const noise = new noisejs.Noise(seed++);

            for (let i = 0; i < segments; ++i) {
                const sampleAt = i * Terrain.METERS_PER_SEGMENT;

                heights[i] -= (1 + noise.simplex2(
                    (sampleX * sampleAt) / scale,
                    (sampleY * sampleAt) / scale)) * octave * 0.5 * heightMultiplier;
            }

            scale /= TerrainRugged.FALLOFF;
        }

        return heights;
    }
}

TerrainRugged.OCTAVES = 3;
TerrainRugged.FALLOFF = 2;
TerrainRugged.HEIGHT_MIN = 0;
TerrainRugged.HEIGHT_MAX = 3;
TerrainRugged.AMP_MIN = 0.2;
TerrainRugged.AMP_MAX = 1;
TerrainRugged.SCALE_MIN = 4;
TerrainRugged.SCALE_MAX = 16;