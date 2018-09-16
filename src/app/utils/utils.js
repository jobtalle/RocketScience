/**
 * Several utilities.
 */
export const Utils = {
    /**
     * Convert a color to a valid css color string.
     * @param {Myr.Color} color A color.
     */
    colorToCss: function(color) {
        return "rgba(" +
            Math.floor(color.r * 256) + "," +
            Math.floor(color.g * 256) + "," +
            Math.floor(color.b * 256) + "," +
            color.a + ")";
    }
};