/**
 * @param {Array} pins An array containing the pin indices.
 * @param {PartRenderer} renderer A part renderer to render state to.
 * @constructor
 */
export function GateNot(pins, renderer) {
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
        if (state[pins[GateNot.PIN_INDEX_POWER]] === 1 &&
            state[pins[GateNot.PIN_INDEX_IN]] === 0) {
            state[pins[GateNot.PIN_INDEX_OUTPUT]] = 1;
        }
        else
            state[pins[GateNot.PIN_INDEX_OUTPUT]] = 0;
    };
}

GateNot.PIN_INDEX_POWER = 0;
GateNot.PIN_INDEX_OUTPUT = 1;
GateNot.PIN_INDEX_IN = 2;