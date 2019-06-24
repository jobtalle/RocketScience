/**
 * An adder circuit.
 * @param {Array} pins An array containing the pin indices.
 * @constructor
 */
function Adder(pins) {
    const PIN_INDEX_POWER = 0;
    const PIN_INDEX_OUTPUT = 1;
    const PIN_INDEX_INPUT_1 = 2;
    const PIN_INDEX_INPUT_2 = 3;

    this.initialize = () => {

    };

    this.tick = state => {
        if (state[pins[PIN_INDEX_POWER]] !== 1)
            state[pins[PIN_INDEX_OUTPUT]] = 0;
        else
            state[pins[PIN_INDEX_OUTPUT]] = Math.min(
                1,
                state[pins[PIN_INDEX_INPUT_1]] +
                state[pins[PIN_INDEX_INPUT_2]]);
    };
}
