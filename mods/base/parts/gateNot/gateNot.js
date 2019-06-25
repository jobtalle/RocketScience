/**
 * A NOT gate.
 * @param {Object} context An object containing the game context, and references to some important utils.
 * @constructor
 */
function GateNot(context) {
    const PIN_INDEX_POWER = 0;
    const PIN_INDEX_OUTPUT = 1;
    const PIN_INDEX_IN = 2;
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
        if (state[context.pins[PIN_INDEX_POWER]] === 1 &&
            state[context.pins[PIN_INDEX_IN]] === 0) {
            state[context.pins[PIN_INDEX_OUTPUT]] = 1;
        }
        else
            state[context.pins[PIN_INDEX_OUTPUT]] = 0;
    };
}