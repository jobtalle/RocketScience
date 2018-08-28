/**
 * Constructs a part.
 * @param {Object} definition A valid part from parts.json.
 * @param {Number} configurationIndex The index of the used configuration.
 * @param {Object} behavior A valid part behavior instance.
 * @constructor
 */
export function Part(definition, configurationIndex, behavior) {
    /**
     * Get this parts definition as defined in parts.json.
     * @returns {Object} A part definition.
     */
    this.getDefinition = () => definition;

    /**
     * Get this parts behavior.
     * @returns {Object} A behavior instance matching this parts definition.
     */
    this.getBehavior = () => behavior;

    /**
     * Get the index of the parts configuration.
     * @returns {Number} The part configuration index.
     */
    this.getConfigurationIndex = () => configurationIndex;

    /**
     * Get this parts configuration.
     * @returns {Object} The configuration.
     */
    this.getConfiguration = () => definition.configurations[configurationIndex];

    /**
     * Copy this part.
     * @returns {Part} A deep copy of this part.
     */
    this.copy = () => {
        return new Part(definition, configurationIndex, behavior.copy());
    };
}