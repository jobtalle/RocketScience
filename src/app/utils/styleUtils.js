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
    }
};