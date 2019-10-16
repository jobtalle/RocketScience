/**
 * An adder circuit.
 * @param {Object} context An object containing the game context, and references to some important utils.
 * @constructor
 */
function Adder(context) {
    const PIN_INDEX_OUTPUT = 0;
    const PIN_INDEX_INPUT_1 = 1;
    const PIN_INDEX_INPUT_2 = 2;

    this.initialize = () => {

    };

    this.tick = state => {
        state[context.pins[PIN_INDEX_OUTPUT]] = Math.min(
            1,
            state[context.pins[PIN_INDEX_INPUT_1]] +
            state[context.pins[PIN_INDEX_INPUT_2]]);
    };
}
