import {Terrain} from "../terrain";
import noisejs from "noisejs"
import {Scale} from "../../world/scale";

/**
 * A set of terrain ornaments scattered over the terrain.
 * Scatters have a heterogeneous distribution.
 * @param {RenderContext} renderContext A render context.
 * @param {Terrain} terrain A terrain to scatter on.
 * @param {ScatterProfile} profile A scatter profile.
 * @constructor
 */
export function Scatters(renderContext, terrain, profile) {
    const _sprites = [];
    const _seed = Scatters.makeSeed(terrain);

    const makeDistribution = (seed, resolution) => {
        const noise = new noisejs.Noise(seed);
        const values = [];

        for (let x = 0; x < terrain.getHeights().length * Terrain.PIXELS_PER_SEGMENT; x += resolution) {
            values.push(noise.simplex2(x * Scale.METERS_PER_PIXEL, 0.5) > 0.3);
        }

        return values;
    };

    const getSpriteIndex = (coords, frames) => {
        return Math.round(Math.abs(coords) * 4242) % frames;
    };

    const generate = () => {
        let seed = _seed;

        for (const entry of profile.getEntries()) {
            seed = (seed + entry.prevalence) % 1;

            const sprite = renderContext.getSprites().getSprite(entry.spriteName);
            const interval = Math.ceil(sprite.getWidth() * 0.5);
            const distribution = makeDistribution(seed, interval);
            let x = 0;

            for (const place of distribution) {
                x += interval;

                if (place) {
                    const y = Math.round(terrain.getHeight(x * Scale.METERS_PER_PIXEL) * Scale.PIXELS_PER_METER);

                    _sprites.push(new Scatters.SpriteEntry(
                        sprite,
                        getSpriteIndex(x + y * 0.1, sprite.getFrameCount()),
                        x - Math.round(sprite.getWidth() * 0.5),
                        y - sprite.getHeight()));
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

    this.copy = () => new Scatters.SpriteEntry(sprite, frame, x, y);
};