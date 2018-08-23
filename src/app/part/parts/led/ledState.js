/**
 * @param {Object} behavior A behavior object matching this state object.
 * @param {Array} pins An array containing the pin indices.
 * @param {PartRenderer} renderer A part renderer to render state to.
 * @constructor
 */
export function LedState(behavior, pins, renderer) {
    /**
     * Initialize the state.
     * @param {Physics.Body} body A physics body to apply state to.
     */
    this.initialize = body => {

    };

    /**
     * Update the state.
     * @param {Array} state A state array to read from and/or write to.
     * @param {Physics.Body} body A physics body to apply state to.
     */
    this.tick = (state, body) => {
        renderer.getSprites()[LedState.SPRITE_INDEX_LIGHT].setFrame(
            state[pins[LedState.PIN_INDEX_POWER]]
        );
    };
}

LedState.SPRITE_INDEX_LIGHT = 0;
LedState.PIN_INDEX_POWER = 0;