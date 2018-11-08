/**
 * A transistor used as a switch. It conducts a signal from its collector to its emitter if the base is powered.
 * @param {Array} pins An array containing the pin indices.
 * @param {PartRenderer} renderer A part renderer to render state to.
 * @constructor
 */
export function Transistor(pins, renderer) {
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
        if (state[pins[Transistor.PIN_INDEX_BASE]] === 0)
            state[pins[Transistor.PIN_INDEX_EMITTER]] = 0;
        else
            state[pins[Transistor.PIN_INDEX_EMITTER]] = state[pins[Transistor.PIN_INDEX_COLLECTOR]];
    };
}

Transistor.PIN_INDEX_COLLECTOR = 0;
Transistor.PIN_INDEX_BASE = 1;
Transistor.PIN_INDEX_EMITTER = 2;
