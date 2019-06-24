/**
 * @param {Array} pins An array containing the pin indices.
 * @param {PartRenderer} renderer A part renderer to render state to.
 * @constructor
 */
function Oscillator(context) {
    let _state = 0;

    const PIN_INDEX_POWER = 0;
    const PIN_INDEX_PULSE = 1;

    /**
     * Initialize the state.
     * @param {PartRenderer} renderer A part renderer to render state to.
     * @param {Physics} body A physics body to apply state to.
     */
    this.initialize = (renderer, body) => {

    };

    /**
     * Update the state.
     * @param {Array} state A state array to read from and/or write to.
     */
    this.tick = state => {
        if (state[context.pins[PIN_INDEX_POWER]] === 1) {
            _state = 1 - _state;

            state[context.pins[PIN_INDEX_PULSE]] = _state;
        }
        else
            _state = state[context.pins[PIN_INDEX_PULSE]] = 0;
    };
}
