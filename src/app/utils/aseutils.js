export function forChunkPixels(chunks, innerFunc) {
    for (const chunk of chunks)
        if (chunk.type === 0x2005)
            for (let x = 0; x < chunk.width; ++x)
                for (let y = 0; y < chunk.height; ++y)
                    innerFunc(x, y, chunk);
}