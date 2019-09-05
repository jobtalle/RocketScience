/**
 * Get all pixels in an array of chunks.
 * @param {Array} chunks The chunks to iterate over.
 * @param {Number} width The sprite width.
 * @param {Number} height The sprite height.
 * @param {String} colorDepth The color depth of the pixels.
 * @returns {Uint8Array} An array containing all pixel values as unsigned bytes.
 */
export function getChunksPixels(chunks, width, height, colorDepth) {
    const pixels = new Uint8Array(width * height << 2);

    const palette = [];

    if (colorDepth === "Indexed")
        for (const chunk of chunks) if (chunk.type === 0x2019)
            for (const paletteEntry of chunk.paletteEntries) {
                const pixel = {};
                pixel.r = paletteEntry.r;
                pixel.g = paletteEntry.g;
                pixel.b = paletteEntry.b;
                pixel.a = paletteEntry.a;

                palette.push(pixel);
            }

    for (const chunk of chunks) if (chunk.type === 0x2005)
        for (let y = 0; y < chunk.height; ++y) for (let x = 0; x < chunk.width; ++x) {
            const index = ((y + chunk.ypos) * width + chunk.xpos + x) << 2;

            switch (colorDepth) {
                case "RGBA":
                    pixels[index] = chunk.pixels[y][x].r;
                    pixels[index + 1] = chunk.pixels[y][x].g;
                    pixels[index + 2] = chunk.pixels[y][x].b;
                    pixels[index + 3] = chunk.pixels[y][x].a;

                    break;
                case "Grayscale":
                    pixels[index] = chunk.pixels[y][x].value;
                    pixels[index + 1] = chunk.pixels[y][x].value;
                    pixels[index + 2] = chunk.pixels[y][x].value;
                    pixels[index + 3] = chunk.pixels[y][x].alpha;

                    break;
                case "Indexed":
                    pixels[index] = palette[chunk.pixels[y][x].index].r;
                    pixels[index + 1] = palette[chunk.pixels[y][x].index].g;
                    pixels[index + 2] = palette[chunk.pixels[y][x].index].b;
                    pixels[index + 3] = palette[chunk.pixels[y][x].index].a;

                    break;
            }
        }

    return pixels;
}

/**
 * Copy all pixels from an array of chunks to a position in a sprite array.
 * @param {Uint8Array} pixels A pixel array representing the target image.
 * @param {Array} chunks The chunks to iterate over.
 * @param {Number} left The left position in the target array.
 * @param {Number} top The top position in the target array.
 * @param {Number} width The width of the target in pixels.
 */
export function copyChunkPixels(pixels, chunks, left, top, width) {
    for (const chunk of chunks) if (chunk.type === 0x2005)
        for (let y = 0; y < chunk.height; ++y) for (let x = 0; x < chunk.width; ++x) {
            const index = ((top + y + chunk.ypos) * width + left + x + chunk.xpos) << 2;

            pixels[index] = chunk.pixels[y][x].r;
            pixels[index + 1] = chunk.pixels[y][x].g;
            pixels[index + 2] = chunk.pixels[y][x].b;
            pixels[index + 3] = chunk.pixels[y][x].a;
        }
}