/**
 * @param {Array} pins An array containing the pin indices.
 * @constructor
 */
export function GateAnd(pins) {
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
        if (state[pins[GateAnd.PIN_INDEX_POWER]] === 1 && (
            state[pins[GateAnd.PIN_INDEX_IN_1]] === 1 &&
            state[pins[GateAnd.PIN_INDEX_IN_2]] === 1)) {
            state[pins[GateAnd.PIN_INDEX_OUTPUT]] = 1;

            return;
        }

        state[pins[GateAnd.PIN_INDEX_OUTPUT]] = 0;
    };
}

GateAnd.PIN_INDEX_POWER = 0;
GateAnd.PIN_INDEX_OUTPUT = 1;
GateAnd.PIN_INDEX_IN_1 = 2;
GateAnd.PIN_INDEX_IN_2 = 3;