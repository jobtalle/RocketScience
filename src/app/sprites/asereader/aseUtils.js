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
    let celChunk = {};
    let paletteChunk = {};

    for (const chunk of chunks) {
        if (chunk.type === 0x2005)
            celChunk = chunk;
        if (chunk.type === 0x2019)
            paletteChunk = chunk;
    }

    copyChunkPixels(pixels, celChunk, paletteChunk, 0, 0, width, colorDepth);

    return pixels;
}

/**
 * Copy all pixels from an array of chunks to a position in a sprite array.
 * @param {Uint8Array} pixels A pixel array representing the target image.
 * @param {Object} celChunk The chunk that contains the pixel data.
 * @param {Object} paletteChunk The chunk that contains the palette pixel data.
 * @param {Number} left The left position in the target array.
 * @param {Number} top The top position in the target array.
 * @param {Number} width The width of the target in pixels.
 * @param {String} colorDepth The color depth of the pixel data.
 */
export function copyChunkPixels(pixels, celChunk, paletteChunk, left, top, width, colorDepth) {
    const palette = [];

    if (colorDepth === "Indexed")
        for (const paletteEntry of paletteChunk.paletteEntries) {
            const pixel = {};
            pixel.r = paletteEntry.r;
            pixel.g = paletteEntry.g;
            pixel.b = paletteEntry.b;
            pixel.a = paletteEntry.a;

            palette.push(pixel);
        }

    for (let y = 0; y < celChunk.height; ++y) for (let x = 0; x < celChunk.width; ++x) {
        const index = ((top + y + celChunk.ypos) * width + left + x + celChunk.xpos) << 2;

        switch (colorDepth) {
            case "RGBA":
                pixels[index] = celChunk.pixels[y][x].r;
                pixels[index + 1] = celChunk.pixels[y][x].g;
                pixels[index + 2] = celChunk.pixels[y][x].b;
                pixels[index + 3] = celChunk.pixels[y][x].a;

                break;
            case "Grayscale":
                pixels[index] = celChunk.pixels[y][x].value;
                pixels[index + 1] = celChunk.pixels[y][x].value;
                pixels[index + 2] = celChunk.pixels[y][x].value;
                pixels[index + 3] = celChunk.pixels[y][x].alpha;

                break;
            case "Indexed":
                pixels[index] = palette[celChunk.pixels[y][x].index].r;
                pixels[index + 1] = palette[celChunk.pixels[y][x].index].g;
                pixels[index + 2] = palette[celChunk.pixels[y][x].index].b;
                pixels[index + 3] = palette[celChunk.pixels[y][x].index].a;

                break;
        }
    }
}