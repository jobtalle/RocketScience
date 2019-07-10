import Myr from "myr.js";
import {createAtlas} from "apl-image-packer";
import {powerCeil} from "../utils/powerCeil";
import {forChunkPixels} from "../utils/aseutils";

/**
 * Register all sprites in myr.
 * @param {Myr} myr The graphics engine.
 * @param {Array} rawSprites The array of all sprite files.
 */
export function registerSprites(myr, rawSprites) {
    const _surfaces = [];

    for (const file of rawSprites)
        for (const frame of file.frames) {
            const surface = new myr.Surface(file.header.width, file.header.height);
            const name = file.name + '_' + file.frames.indexOf(frame);

            surface.bind();
            surface.clear();

            //TODO: extend Myr with method to draw pixel array in one function call.
            forChunkPixels(frame.chunks, (x, y, chunk) => {
                myr.primitives.drawPoint(new Myr.Color(
                    chunk.pixels[y][x].r / 255,
                    chunk.pixels[y][x].g / 255,
                    chunk.pixels[y][x].b / 255,
                    chunk.pixels[y][x].a / 255
                ), x + chunk.xpos, y + chunk.ypos);
            });

            _surfaces.push({
                width: surface.getWidth(),
                height: surface.getHeight(),
                surface: surface,
                name: name,
                duration: frame.frameHeader.frameDuration
            });
        }

    const _packedSprites = createAtlas(_surfaces);
    const _spriteSheet = new myr.Surface(powerCeil(_packedSprites.width), powerCeil(_packedSprites.height));

    _spriteSheet.bind();
    _spriteSheet.clear();

    const _atlas = {frames: {}};

    for (const entry of _packedSprites.coords) {
        entry.img.surface.draw(entry.x, entry.y);
        _atlas.frames[entry.img.name] = {
            frame: {x: entry.x, y: entry.y, w: entry.img.width, h: entry.img.height},
            duration: entry.img.duration
        };
    }

    for (const sprite of rawSprites) {
        const spriteFrames = [];
        let frameIndex = 0;
        let frame = _atlas.frames[sprite.name + '_' + frameIndex];

        while (frame != null) {
            const spriteFrame = myr.makeSpriteFrame(_spriteSheet, frame.frame.x, frame.frame.y, frame.frame.w, frame.frame.h, 0, 0, frame.duration * 0.001);

            spriteFrames.push(spriteFrame);
            frame = _atlas.frames[sprite.name + '_' + ++frameIndex];
        }

        myr.register(sprite.name, ...spriteFrames);
    }

    myr.flush();

    for (const surface of _surfaces)
        surface.surface.free();
}