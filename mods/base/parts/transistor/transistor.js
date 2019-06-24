/**
 * A transistor used as a switch. It conducts a signal from its collector to its emitter if the base is powered.
 * @param {Array} pins An array containing the pin indices.
 * @param {PartRenderer} renderer A part renderer to render state to.
 * @constructor
 */
function Transistor(context) {
    const PIN_INDEX_COLLECTOR = 0;
    const PIN_INDEX_BASE = 1;
    const PIN_INDEX_EMITTER = 2;

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
        if (state[context.pins[PIN_INDEX_BASE]] === 0)
            state[context.pins[PIN_INDEX_EMITTER]] = 0;
        else
            state[context.pins[PIN_INDEX_EMITTER]] = state[context.pins[PIN_INDEX_COLLECTOR]];
    };
}

