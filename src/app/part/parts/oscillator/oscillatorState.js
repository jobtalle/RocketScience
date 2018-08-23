/**
 * @param {Object} behavior A behavior object matching this state object.
 * @param {Array} pins An array containing the pin indices.
 * @param {PartRenderer} renderer A part renderer to render state to.
 * @constructor
 */
export function OscillatorState(behavior, pins, renderer) {
    /**
     * Initialize the state.
     * @param {PartRenderer} renderer A part renderer to render state to.
     * @param {Physics.Body} body A physics body to apply state to.
     */
    this.initialize = (renderer, body) => {

    };

    /**
     * Update the state.
     * @param {Array} state A state array to read from and/or write to.
     * @param {PcbRenderer} renderer A pcb renderer to render state to.
     * @param {Physics.Body} body A physics body to apply state to.
     */
    this.tick = (state, renderer, body) => {
        state[pins[OscillatorState.PIN_INDEX_PULSE]] = 1 - state[pins[OscillatorState.PIN_INDEX_PULSE]];
    };
}

OscillatorState.PIN_INDEX_POWER = 0;
OscillatorState.PIN_INDEX_PULSE = 1;