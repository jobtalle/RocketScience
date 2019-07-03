function randomize(seed, x, y) {
    const RND_A = 134775813;
    const RND_B = 1103515245;

    return (((((x ^ y) * RND_A) ^ (seed + x)) * (((RND_B * x) << 16) ^ (RND_B * y) - RND_A)) >>> 0) / 4294967295;
}

function tile(coordinate, period) {
    if (coordinate < 0)
        coordinate += period;

    return coordinate % period;
}

function interpolate(a, b, c, d, x) {
    const p = (d - c) - (a - b);

    return x * (x * (x * p + ((a - b) - p)) + (c - a)) + b;
}

export function cubicNoiseConfig(seed, octave, periodx = Number.MAX_SAFE_INTEGER, periody = Number.MAX_SAFE_INTEGER) {
    return {
        seed: seed,
        octave: octave,
        periodx: periodx,
        periody: periody
    }
}

export function cubicNoiseSample1(config, x) {
    const xi = Math.floor(x / config.octave);
    const lerp = x / config.octave - xi;

    return interpolate(
        randomize(config.seed, tile(xi - 1, config.periodx), 0),
        randomize(config.seed, tile(xi, config.periodx), 0),
        randomize(config.seed, tile(xi + 1, config.periodx), 0),
        randomize(config.seed, tile(xi + 2, config.periodx), 0),
        lerp) * 0.5 + 0.25;
}

export function cubicNoiseSample2(config, x, y) {
    const xi = Math.floor(x / config.octave);
    const lerpx = x / config.octave - xi;
    const yi = Math.floor(y / config.octave);
    const lerpy = y / config.octave - yi;

    const xSamples = new Array(4);

    for(let i = 0; i < 4; ++i)
        xSamples[i] = interpolate(
            randomize(config.seed, tile(xi - 1, config.periodx), tile(yi - 1 + i, config.periody)),
            randomize(config.seed, tile(xi, config.periodx), tile(yi - 1 + i, config.periody)),
            randomize(config.seed, tile(xi + 1, config.periodx), tile(yi - 1 + i, config.periody)),
            randomize(config.seed, tile(xi + 2, config.periodx), tile(yi - 1 + i, config.periody)),
            lerpx);

    return interpolate(xSamples[0], xSamples[1], xSamples[2], xSamples[3], lerpy) * 0.5 + 0.25;
}