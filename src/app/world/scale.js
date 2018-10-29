const pixelsPerPoint = 6;
const pointsPerMeter = 8;

/**
 * Several constants defining scale and unit conversions in the world.
 */
export const Scale = {
    PIXELS_PER_POINT: pixelsPerPoint,
    PIXELS_PER_METER: pixelsPerPoint * pointsPerMeter,

    POINTS_PER_METER: pointsPerMeter,

    METERS_PER_PIXEL: 1 / (pixelsPerPoint * pointsPerMeter),
    METERS_PER_POINT: pixelsPerPoint / (pixelsPerPoint * pointsPerMeter)
};