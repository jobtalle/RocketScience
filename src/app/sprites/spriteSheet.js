import Myr from "myr.js";
import {createAtlas} from "apl-image-packer";
import {powerCeil} from "../utils/powerCeil";
import {getRawSprites} from "../utils/partLoader";

export function SpriteSheet(myr) {
    const _atlas = {frames: {}};

    const buildPacked = () => {
        const surfaces = [];

        for (const file of getRawSprites()) {
            for (const frame of file.frames) {
                const surface = new myr.Surface(file.header.width, file.header.height);
                const name = file.name + '_' + file.frames.indexOf(frame);
                surface.bind();
                surface.clear();

                for (const chunk of frame.chunks) {
                    if (chunk.type === 0x2005) {
                        for (let x = 0; x < chunk.width; ++x)
                            for (let y = 0; y < chunk.height; ++y) {
                                myr.primitives.drawPoint(new Myr.Color(
                                    chunk.pixels[y][x].r / 255,
                                    chunk.pixels[y][x].g / 255,
                                    chunk.pixels[y][x].b / 255,
                                    chunk.pixels[y][x].a / 255
                                ), x + chunk.xpos, y + chunk.ypos);
                            }
                        break;
                    }
                }
                surfaces.push({
                    width: surface.getWidth(),
                    height: surface.getHeight(),
                    surface: surface,
                    name: name,
                    duration: frame.frameHeader.frameDuration
                });
            }
        }

        return createAtlas(surfaces);
    };

    const drawSheet = () => {
        _spriteSheet.bind();
        _spriteSheet.clear();

        for (const entry of _packedSprites.coords) {
            entry.img.surface.draw(entry.x, entry.y);
            _atlas.frames[entry.img.name] = {
                frame: {x: entry.x, y: entry.y, w: entry.img.width, h: entry.img.height},
                duration: entry.img.duration
            };
        }
    };

    this.getSurface = () => _spriteSheet;

    this.getAtlas = () => _atlas;

    const _packedSprites = buildPacked();
    const _spriteSheet = new myr.Surface(powerCeil(_packedSprites.width), powerCeil(_packedSprites.height));

    drawSheet();

    // myr.bind();
    // myr.setClearColor(Myr.Color.WHITE);
    // myr.clear();
    // _spriteSheet.draw(0,0);
    // myr.flush();
}