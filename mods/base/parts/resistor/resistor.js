/**
 * A
 * @param {Array} pins An array containing the pin indices.
 * @constructor
 */
function Resistor(context) {
    const RESISTANCE = 0.5;
    const PIN_INDEX_INPUT = 0;
    const PIN_INDEX_OUTPUT = 1;

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
        state[context.pins[PIN_INDEX_OUTPUT]] = state[context.pins[PIN_INDEX_INPUT]] * RESISTANCE;
    };
}
