/**
 * @param {Array} pins An array containing the pin indices.
 * @param {PartRenderer} renderer A part renderer to render state to.
 * @constructor
 */
export function GateXor(pins, renderer) {
    /**
     * Initialize the state.
     * @param {Physics} body A physics body to apply state to.
     */
    this.initialize = body => {

    };

    /**
     * Update the state.
     * @param {Array} state A state array to read from and/or write to.
     */
    this.tick = state => {
        if (state[pins[GateXor.PIN_INDEX_POWER]] === 1 && ((
            state[pins[GateXor.PIN_INDEX_IN_1]] === 1 &&
            state[pins[GateXor.PIN_INDEX_IN_2]] === 0) || (
            state[pins[GateXor.PIN_INDEX_IN_2]] === 1 &&
            state[pins[GateXor.PIN_INDEX_IN_1]] === 0))) {
            state[pins[GateXor.PIN_INDEX_OUTPUT]] = 1;

            return;
        }

        state[pins[GateXor.PIN_INDEX_OUTPUT]] = 0;
    };
}

GateXor.PIN_INDEX_POWER = 0;
GateXor.PIN_INDEX_OUTPUT = 1;
GateXor.PIN_INDEX_IN_1 = 2;
GateXor.PIN_INDEX_IN_2 = 3;