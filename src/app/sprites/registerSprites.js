import Myr from "myr.js";
import {createAtlas} from "apl-image-packer";
import {powerCeil} from "../utils/powerCeil";
import {copyChunkPixels} from "./asereader/aseUtils";

/**
 * Register all sprites in myr.
 * @param {Myr} myr The graphics engine.
 * @param {Array} spriteFiles The array of all sprite files.
 */
export function registerSprites(myr, spriteFiles) {
    const images = [];
    const sprites = {};

    for (const sprite of spriteFiles) {
        let paletteChunk = {};

        sprites[sprite.name] = new Array(sprite.frames.length).fill(null);

        if (sprite.frames.length > 0)
            for (const chunk of sprite.frames[0].chunks) if (chunk.type === 0x2019)
                paletteChunk = chunk;

        for (let frame = 0; frame < sprite.frames.length; ++frame) {
            let celChunk = {};

            for (const chunk of sprite.frames[frame].chunks) if (chunk.type === 0x2005)
                celChunk = chunk;

            images.push({
                width: sprite.header.width,
                height: sprite.header.height,
                celChunk: celChunk,
                paletteChunk: paletteChunk,
                name: sprite.name,
                frame: frame,
                duration: sprite.frames[frame].frameHeader.frameDuration,
                colorDepth: sprite.header.colorDepth
            });
        }
    }

    const atlas = createAtlas(images);
    const width = powerCeil(atlas.width);
    const height = powerCeil(atlas.height);
    const pixels = new Uint8Array(width * height << 2);

    for (const entry of atlas.coords)
        copyChunkPixels(pixels, entry.img.celChunk, entry.img.paletteChunk, entry.x, entry.y, width, entry.img.colorDepth);

    // TODO: The sprite sheet is never freed
    const surface = new myr.Surface(width, height, pixels);

    for (const entry of atlas.coords)
        sprites[entry.img.name][entry.img.frame] = myr.makeSpriteFrame(
            surface,
            entry.x,
            entry.y,
            entry.img.width,
            entry.img.height,
            0,
            0,
            entry.img.duration * 0.001);

    for (const name in sprites) if (sprites.hasOwnProperty(name))
        myr.register(name, ...sprites[name]);
}