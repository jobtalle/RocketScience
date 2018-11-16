import {getPartFromId, getPartId} from "./objects";

/**
 * Constructs a part.
 * @param {Object} definition A valid part from parts.json.
 * @param {Number} configurationIndex The index of the used configuration.
 * @constructor
 */
export function Part(definition, configurationIndex) {
    /**
     * Get this parts definition as defined in parts.json.
     * @returns {Object} A part definition.
     */
    this.getDefinition = () => definition;

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
     * Get the index of the pin at a given location.
     * @param {Number} x The x position on this part.
     * @param {Number} y The y position on this part.
     * @returns {Number} The pin index at this location, or -1 if no pin exists here.
     */
    this.getPinIndexAt = (x, y) => {
        let index = 0;

        for (const pin of this.getConfiguration().io) {
            if (pin.x === x && pin.y === y)
                return index;

            ++index;
        }

        return -1;
    };

    /**
     * Copy this part.
     * @returns {Part} A deep copy of this part.
     */
    this.copy = () => {
        return new Part(definition, configurationIndex);
    };

    /**
     * Serialize this part to a buffer.
     * @param {ByteBuffer} buffer A byte buffer to serialize this part to.
     */
    this.serialize = buffer => {
        buffer.writeByte(getPartId(definition.object));
        buffer.writeByte(configurationIndex);
    };
}

/**
 * Deserialize a part from a buffer.
 * @param {ByteBuffer} buffer A byte buffer to serialize a part from.
 */
Part.deserialize = buffer => {
    const id = buffer.readByte();
    const configuration = buffer.readByte();

    return new Part(getPartFromId(id), configuration);
};