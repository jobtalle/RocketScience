/**
 * A press-able button.
 * @param {Object} context An object containing the game context, and references to some important utils.
 * @constructor
 */
function ControllerUp(context) {
    const PIN_INDEX_OUT = 0;
    const SPRITE_INDEX_BUTTON = 1;

    let _controllerState = null;

    /**
     * Initialize the state.
     * @param {Object} body A physics body to apply state to.
     * @param {ControllerState} controllerState A controller state to read input from.
     */
    this.initialize = (body, controllerState) => {
        _controllerState = controllerState;
    };

    /**
     * Update the state.
     * @param {Array} state A state array to read from and/or write to.
     */
    this.tick = state => {
        state[context.pins[PIN_INDEX_OUT]] = _controllerState.getKeyUp()?1:0;
        context.renderer.getSprites()[SPRITE_INDEX_BUTTON].setFrame(
            state[context.pins[PIN_INDEX_OUT]]
        );
    };
}