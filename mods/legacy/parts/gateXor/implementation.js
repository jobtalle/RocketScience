/**
 * An XOR gate.
 * @param {Object} context An object containing the game context, and references to some important utils.
 * @constructor
 */
function GateXor(context) {
    const PIN_INDEX_POWER = 0;
    const PIN_INDEX_OUTPUT = 1;
    const PIN_INDEX_IN_1 = 2;
    const PIN_INDEX_IN_2 = 3;

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
        if (state[context.pins[PIN_INDEX_POWER]] === 1 && ((
            state[context.pins[PIN_INDEX_IN_1]] === 1 &&
            state[context.pins[PIN_INDEX_IN_2]] === 0) || (
            state[context.pins[PIN_INDEX_IN_2]] === 1 &&
            state[context.pins[PIN_INDEX_IN_1]] === 0))) {
            state[context.pins[PIN_INDEX_OUTPUT]] = 1;

            return;
        }

        state[context.pins[PIN_INDEX_OUTPUT]] = 0;
    };
}
