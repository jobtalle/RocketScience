/**
 * @param {Array} pins An array containing the pin indices.
 * @param {PartRenderer} renderer A part renderer to render state to.
 * @constructor
 */
export function Oscillator(pins, renderer) {
    let _state = 0;

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
        if (state[pins[Oscillator.PIN_INDEX_POWER]] === 1) {
            _state = 1 - _state;

            state[pins[Oscillator.PIN_INDEX_PULSE]] = _state;
        }
        else
            _state = state[pins[Oscillator.PIN_INDEX_PULSE]] = 0;
    };
}

Oscillator.PIN_INDEX_POWER = 0;
Oscillator.PIN_INDEX_PULSE = 1;