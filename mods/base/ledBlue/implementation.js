/**
 * A simple LED.
 * @param {Object} context An object containing the game context, and references to some important utils.
 * @constructor
 */
function LedBlue(context) {
    const SPRITE_INDEX_LIGHT = 0;
    const PIN_INDEX_POWER = 0;

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
        context.renderer.getSprites()[SPRITE_INDEX_LIGHT].setFrame(
            state[context.pins[PIN_INDEX_POWER]] === 1?1:0
        );
    };
}
