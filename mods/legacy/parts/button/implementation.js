/**
 * A press-able button.
 * @param {Object} context An object containing the game context, and references to some important utils.
 * @constructor
 */
function Button(context) {
    const X_OFFSET = 0;
    const Y_OFFSET = -1;
    const WIDTH = 2;
    const HEIGHT = 2;
    const PRESS_TICKS = 3;
    const SPRITE_INDEX_BUTTON = 1;
    const SPRITE_FRAME_RELEASED = 0;
    const SPRITE_FRAME_PRESSED = 1;
    const PIN_INDEX_IN = 0;
    const PIN_INDEX_OUT = 1;

    let _body = null;
    let _controllerState = null;
    let _pressed = 0;

    /**
     * Initialize the state.
     * @param {Object} body A physics body to apply state to.
     * @param {ControllerState} controllerState A controller state to read input from.
     */
    this.initialize = (body, controllerState) => {
        _body = body;
        _controllerState = controllerState;
    };

    /**
     * Update the state.
     * @param {Array} state A state array to read from and/or write to.
     */
    this.tick = state => {
        for (const click of _controllerState.getClicks()) if (click.target === _body) {
            if (
                click.point.x >= context.x + X_OFFSET &&
                click.point.x < context.x + X_OFFSET + WIDTH &&
                click.point.y >= context.y + Y_OFFSET &&
                click.point.y < context.y + Y_OFFSET + HEIGHT) {
                _pressed = PRESS_TICKS + 1;

                context.renderer.getSprites()[SPRITE_INDEX_BUTTON].setFrame(SPRITE_FRAME_PRESSED);
            }
        }

        if (_pressed > 0) {
            state[context.pins[PIN_INDEX_OUT]] = state[context.pins[PIN_INDEX_IN]];

            if (--_pressed === 0)
                context.renderer.getSprites()[SPRITE_INDEX_BUTTON].setFrame(SPRITE_FRAME_RELEASED);
        }
        else
            state[context.pins[PIN_INDEX_OUT]] = 0;
    };
}