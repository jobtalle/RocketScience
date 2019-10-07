/**
 * An AND gate.
 * @param {Object} context An object containing the game context, and references to some important utils.
 * @constructor
 */
function GateAnd(context) {
    const PIN_INDEX_OUTPUT = 0;
    const PIN_INDEX_IN_1 = 1;
    const PIN_INDEX_IN_2 = 2;

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
        if ((state[context.pins[PIN_INDEX_IN_1]] !== 0 &&
            state[context.pins[PIN_INDEX_IN_2]] !== 0)) {
            state[context.pins[PIN_INDEX_OUTPUT]] = 1;

            return;
        }

        state[context.pins[PIN_INDEX_OUTPUT]] = 0;
    };
}