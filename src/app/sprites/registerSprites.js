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
        sprites[sprite.name] = new Array(sprite.frames.length).fill(null);

        for (let frame = 0; frame < sprite.frames.length; ++frame)
            images.push({
                width: sprite.header.width,
                height: sprite.header.height,
                chunks: sprite.frames[frame].chunks,
                name: sprite.name,
                frame: frame,
                duration: sprite.frames[frame].frameHeader.frameDuration,
            });
    }

    const atlas = createAtlas(images);
    const width = powerCeil(atlas.width);
    const height = powerCeil(atlas.height);
    const pixels = new Uint8Array(width * height << 2);

    for (const entry of atlas.coords)
        copyChunkPixels(pixels, entry.img.chunks, entry.x, entry.y, width);

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