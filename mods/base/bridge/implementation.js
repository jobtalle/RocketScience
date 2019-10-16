/**
 * A bridge.
 * @param {Object} context An object containing the game context, and references to some important utils.
 * @constructor
 */
function Bridge(context) {
    const PIN_INDEX_INPUT = 0;
    const PIN_INDEX_OUTPUT = 1;

    /**
     * Initialize the state.
     */
    this.initialize = () => {

    };

    /**
     * Update the state.
     * @param {Array} state A state array to read from and/or write to.
     */
    this.tick = state => {
        state[context.pins[PIN_INDEX_OUTPUT]] = state[context.pins[PIN_INDEX_INPUT]];
    };
}
