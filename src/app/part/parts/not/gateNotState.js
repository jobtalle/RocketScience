/**
 * @param {GateNotBehavior} behavior A behavior object matching this state object.
 * @param {Array} pins An array containing the pin indices.
 * @param {PartRenderer} renderer A part renderer to render state to.
 * @constructor
 */
export function GateNotState(behavior, pins, renderer) {
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
        if (state[pins[GateNotState.PIN_INDEX_POWER]] === 1 &&
            state[pins[GateNotState.PIN_INDEX_IN]] === 0) {
            state[pins[GateNotState.PIN_INDEX_OUTPUT]] = 1;

            return;
        }

        state[pins[GateNotState.PIN_INDEX_OUTPUT]] = 0;
    };
}

GateNotState.PIN_INDEX_POWER = 0;
GateNotState.PIN_INDEX_OUTPUT = 1;
GateNotState.PIN_INDEX_IN = 2;