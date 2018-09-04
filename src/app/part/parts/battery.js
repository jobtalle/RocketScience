/**
 * @param {Array} pins An array containing the pin indices.
 * @param {PartRenderer} renderer A part renderer to render state to.
 * @constructor
 */
export function Battery(pins, renderer) {
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
        for (let pin = 0; pin < Battery.PIN_COUNT; ++pin)
            state[pins[pin]] = 1;
    };
}

Battery.PIN_COUNT = 4;