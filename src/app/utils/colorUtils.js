/**
 * Color utilities.
 */
export const ColorUtils = {
    /**
     * Convert a color to a valid css color string.
     * @param {Myr.Color} color A color.
     */
    toCss: function(color) {
        return "rgba(" +
            Math.floor(color.r * 255) + "," +
            Math.floor(color.g * 255) + "," +
            Math.floor(color.b * 255) + "," +
            color.a + ")";
    }
};