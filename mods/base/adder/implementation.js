/**
 * An adder circuit.
 * @param {Object} context An object containing the game context, and references to some important utils.
 * @constructor
 */
function Adder(context) {
    const PIN_INDEX_POWER = 0;
    const PIN_INDEX_OUTPUT = 1;
    const PIN_INDEX_INPUT_1 = 2;
    const PIN_INDEX_INPUT_2 = 3;

    this.initialize = () => {

    };

    this.tick = state => {
        if (state[context.pins[PIN_INDEX_POWER]] !== 1)
            state[context.pins[PIN_INDEX_OUTPUT]] = 0;
        else
            state[context.pins[PIN_INDEX_OUTPUT]] = Math.min(
                1,
                state[context.pins[PIN_INDEX_INPUT_1]] +
                state[context.pins[PIN_INDEX_INPUT_2]]);
    };
}
