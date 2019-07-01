import {Terrain} from "../terrain";
import {Scale} from "../../world/scale";
import {Profiles} from "./profiles";
import {FractalNoise} from "../../utils/fractalNoise";

/**
 * A set of terrain ornaments scattered over the terrain.
 * Scatters have a heterogeneous distribution.
 * @param {RenderContext} renderContext A render context.
 * @param {Terrain} terrain A terrain to scatter on.
 * @constructor
 */
export function Scatters(renderContext, terrain) {
    const _sprites = [];
    const _seed = Scatters.makeSeed(terrain);

    const makeDistribution = (seed, resolution, threshold) => {
        const noise = new FractalNoise(seed, Scatters.NOISE_RESOLUTION, 3);
        const detailNoise = new FractalNoise(seed * seed, 1, 1);
        const values = [];

        for (let x = 0; x < (terrain.getHeights().length - 1) * Terrain.PIXELS_PER_SEGMENT - resolution; x += resolution)
            values.push(noise.sample(x) * 0.5 + 0.5 < threshold && detailNoise.sample(x) > 0);

        return values;
    };

    const getSpriteIndex = (coords, frames) => {
        return Math.round(Math.abs(coords) * 4242) % frames;
    };

    const generate = () => {
        let seed = _seed;

        for (const entry of Profiles.profiles[terrain.getProfile()].getEntries()) {
            seed = (seed + entry.threshold) % 1;

            const sprite = renderContext.getSprites().getSprite(entry.spriteName);
            const interval = Math.ceil(sprite.getWidth() * entry.interval);
            const distribution = makeDistribution(seed, interval, entry.threshold);
            let lastFrame = -1;
            let x = 0;

            for (const place of distribution) {
                x += interval;

                if (place && Math.abs(terrain.getSlope(x * Scale.METERS_PER_PIXEL)) < entry.maxSlope) {
                    const y = Math.round(terrain.getHeight(x * Scale.METERS_PER_PIXEL) * Scale.PIXELS_PER_METER);
                    let frame = getSpriteIndex(x + y * 0.1, sprite.getFrameCount());

                    if (frame === lastFrame)
                        frame = (frame + 1) % sprite.getFrameCount();

                    _sprites.push(new Scatters.SpriteEntry(
                        sprite,
                        frame,
                        x - Math.round(sprite.getWidth() * 0.5),
                        y - sprite.getHeight()));

                    lastFrame = frame;
                }
            }
        }
    };

    /**
     * Get all Scatters.SpriteEntry instances describing all scatters on this terrain.
     * Sprites are ordered from left to right.
     * @returns {Array} An array of placed SpriteEntry instances.
     */
    this.getSprites = () => _sprites;

    generate();
}

Scatters.makeSeed = terrain => {
    return (terrain.getHeights().length * 0.42) % 1;
};

Scatters.SpriteEntry = function(sprite, frame, x, y) {
    this.sprite = sprite;
    this.frame = frame;
    this.x = x;
    this.y = y;
};

Scatters.NOISE_RESOLUTION = 0.007;