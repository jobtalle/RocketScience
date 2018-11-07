/**
 * A resistor.
 * @param {Array} pins An array containing the pin indices.
 * @constructor
 */
export function Resistor(pins) {
    /**
     * Initialize the state.
     */
    this.initialize = () => {

    };

    /**
     * Update the state.
     * @param {Array} state A state array to read from and/or write to.
     */
    this.tick = state => {
        state[pins[Resistor.PIN_INDEX_OUTPUT]] = state[pins[Resistor.PIN_INDEX_INPUT]] * Resistor.RESISTANCE;
    };
}

Resistor.RESISTANCE = 0.5;
Resistor.PIN_INDEX_INPUT = 0;
Resistor.PIN_INDEX_OUTPUT = 1;