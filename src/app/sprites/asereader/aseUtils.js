/**
 * Loop over all pixels in the cell chunk.
 * @param {Array} chunks The chunks to iterate over.
 * @param {Function} onPixel The function to call per pixel.
 */
export function forChunksPixels(chunks, onPixel) {
    for (const chunk of chunks) if (chunk.type === 0x2005)
        for (let x = 0; x < chunk.width; ++x)
            for (let y = 0; y < chunk.height; ++y)
                onPixel(x, y, chunk);
}

/**
 * Get all pixels in an array of chunks.
 * @param {Array} chunks The chunks to iterate over.
 * @param {Number} width The sprite width.
 * @param {Number} height The sprite height.
 * @returns {Uint8Array} An array containing all pixel values as unsigned bytes.
 */
export function getChunksPixels(chunks, width, height) {
    const pixels = new Uint8Array(width * height << 2);

    for (const chunk of chunks) if (chunk.type === 0x2005) {
        for (let y = 0; y < chunk.height; ++y) for (let x = 0; x < chunk.width; ++x) {
            const index = ((y + chunk.ypos) * width + chunk.xpos + x) << 2;

            pixels[index] = chunk.pixels[y][x].r;
            pixels[index + 1] = chunk.pixels[y][x].g;
            pixels[index + 2] = chunk.pixels[y][x].b;
            pixels[index + 3] = chunk.pixels[y][x].a;
        }
    }

    return pixels;
}

/**
 * Loop over all sprites for all parts.
 * @param {Object} parts The definition for all parts.
 * @param {Function} onSprite The function to call per sprite.
 */
export function forAllSprites(parts, onSprite) {
    for (const category of parts.categories)
        for (const part of category.parts)
            for (const config of part.configurations)
                for (const key in config.sprites)
                    for (const sprite of config.sprites[key])
                        onSprite(sprite.name);
}

/**
 * Loop over all icon sprites for all parts.
 * @param {Object} parts The definition for all parts.
 * @param {Function} onIcon The function to call per icon.
 */
export function forAllIcons(parts, onIcon) {
    for (const category of parts.categories)
        for (const part of category.parts)
            onIcon(part.icon);
}