/**
 * @param {BatteryState} behavior A behavior object matching this state object.
 * @param {Array} pins An array containing the pin indices.
 * @param {PartRenderer} renderer A part renderer to render state to.
 * @constructor
 */
export function BatteryState(behavior, pins, renderer) {
    /**
     * Initialize the state.
     * @param {Physics.Body} body A physics body to apply state to.
     */
    this.initialize = body => {

    };

    /**
     * Update the state.
     * @param {Array} state A state array to read from and/or write to.
     */
    this.tick = state => {
        for (let pin = 0; pin < BatteryState.PIN_COUNT; ++pin)
            state[pins[pin]] = 1;
    };
}

BatteryState.PIN_COUNT = 4;