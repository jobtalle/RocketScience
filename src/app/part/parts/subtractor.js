/**
 * A subtractor circuit.
 * @param {Array} pins An array containing the pin indices.
 * @constructor
 */
export function Subtractor(pins) {
    this.initialize = () => {

    };

    this.tick = state => {
        if (state[pins[Subtractor.PIN_INDEX_POWER]] !== 1)
            state[pins[Subtractor.PIN_INDEX_OUTPUT]] = 0;
        else
            state[pins[Subtractor.PIN_INDEX_OUTPUT]] = Math.max(
                0,
                state[pins[Subtractor.PIN_INDEX_INPUT_1]] -
                state[pins[Subtractor.PIN_INDEX_INPUT_2]]);
    };
}

Subtractor.PIN_INDEX_POWER = 0;
Subtractor.PIN_INDEX_OUTPUT = 1;
Subtractor.PIN_INDEX_INPUT_1 = 2;
Subtractor.PIN_INDEX_INPUT_2 = 3;