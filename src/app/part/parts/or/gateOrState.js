/**
 * @param {GateOrBehavior} behavior A behavior object matching this state object.
 * @param {Array} pins An array containing the pin indices.
 * @param {PartRenderer} renderer A part renderer to render state to.
 * @constructor
 */
export function GateOrState(behavior, pins, renderer) {
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
        if (state[pins[GateOrState.PIN_INDEX_POWER]] === 1 && (
            state[pins[GateOrState.PIN_INDEX_IN_1]] === 1 ||
            state[pins[GateOrState.PIN_INDEX_IN_2]] === 1)) {
            state[pins[GateOrState.PIN_INDEX_OUTPUT]] = 1;

            return;
        }

        state[pins[GateOrState.PIN_INDEX_OUTPUT]] = 0;
    };
}

GateOrState.PIN_INDEX_POWER = 0;
GateOrState.PIN_INDEX_OUTPUT = 1;
GateOrState.PIN_INDEX_IN_1 = 2;
GateOrState.PIN_INDEX_IN_2 = 3;