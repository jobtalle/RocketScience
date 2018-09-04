/**
 * @param {Array} pins An array containing the pin indices.
 * @param {PartRenderer} renderer A part renderer to render state to.
 * @constructor
 */
export function Led(pins, renderer) {
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
        renderer.getSprites()[Led.SPRITE_INDEX_LIGHT].setFrame(
            state[pins[Led.PIN_INDEX_POWER]]
        );
    };
}

Led.SPRITE_INDEX_LIGHT = 0;
Led.PIN_INDEX_POWER = 0;