/**
 * Creates an array of octaves to add noise with varying falloffs.
 * @param {Number} count The number of octaves.
 * @param {Number} falloff The number each subsequent influence is divided by.
 * @returns {Array} An array of octave influences that add up to one.
 */
export function makeOctaves(count, falloff) {
    const octaves = [];
    let amp;

    if (falloff === 1)
        amp = 1 / octaves;
    else
        amp = (((falloff - 1) * Math.pow(falloff, count)) / (Math.pow(falloff, count) - 1)) / falloff;

    for (let i = 0; i < count; amp /= falloff, ++i)
        octaves.push(amp);

    return octaves;
}