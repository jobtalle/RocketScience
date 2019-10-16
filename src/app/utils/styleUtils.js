import Myr from "myr.js"

/**
 * CSS utilities.
 */

export const StyleUtils = {
    /**
     * Get the value of a css variable.
     * @param {String} name The variable name.
     * @returns {String} The value of the variable.
     */
    getVariable: function(name) {
        return getComputedStyle(document.body).getPropertyValue(name);
    },

    /**
     * Get a myr color from a constant css variable.
     * @param {String} name The variable name.
     * @return {Myr.Color} The color of the variable.
     */
    getColor: function (name) {
        let color = StyleUtils.getVariable(name).toUpperCase();

        color = color.replace("#", "");
        color = color.replace(" ", "");

        return Myr.Color.fromHex(color);
    }
};