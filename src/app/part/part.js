/**
 * Constructs a part.
 * @param {Object} configuration A valid part configuration.
 * @param {Object} behavior A valid led object matching the configuration governing this parts led.
 * @constructor
 */
export function Part(configuration, behavior) {
    /**
     * Get this parts configuration.
     * @returns {Object} The configuration.
     */
    this.getConfiguration = () => configuration;

    /**
     * Copy this part.
     * @returns {Part} A deep copy of this part.
     */
    this.copy = () => {
        return new Part(configuration, behavior.copy());
    };
}