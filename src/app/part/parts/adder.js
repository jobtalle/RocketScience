/**
 * An adder circuit.
 * @param {Array} pins An array containing the pin indices.
 * @constructor
 */
export function Adder(pins) {
    this.initialize = () => {

    };

    this.tick = state => {
        if (state[pins[Adder.PIN_INDEX_POWER]] !== 1)
            state[pins[Adder.PIN_INDEX_OUTPUT]] = 0;
        else
            state[pins[Adder.PIN_INDEX_OUTPUT]] = Math.min(
                1,
                state[pins[Adder.PIN_INDEX_INPUT_1]] +
                state[pins[Adder.PIN_INDEX_INPUT_2]]);
    };
}

Adder.PIN_INDEX_POWER = 0;
Adder.PIN_INDEX_OUTPUT = 1;
Adder.PIN_INDEX_INPUT_1 = 2;
Adder.PIN_INDEX_INPUT_2 = 3;
