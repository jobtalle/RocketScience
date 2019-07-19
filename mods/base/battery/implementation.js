/**
 * A battery.
 * @param {Object} context An object containing the game context, and references to some important utils.
 * @constructor
 */
function Battery(context) {
    const PIN_INDEX_OUTPUT = 0;

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
        state[context.pins[PIN_INDEX_OUTPUT]] = 1;
    };
}