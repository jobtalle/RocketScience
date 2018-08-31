/**
 * @param {OscillatorBehavior} behavior A behavior object matching this state object.
 * @param {Array} pins An array containing the pin indices.
 * @param {PartRenderer} renderer A part renderer to render state to.
 * @constructor
 */
export function WheelState(behavior, pins, renderer) {
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
     */
    this.tick = state => {

    };
}