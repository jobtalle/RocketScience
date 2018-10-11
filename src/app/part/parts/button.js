/**
 * A press-able button.
 * @param {Array} pins An array containing the pin indices.
 * @param {PartRenderer} renderer A part renderer to render state to.
 * @param {Number} x The x position on the board.
 * @param {Number} y The y position on the board.
 * @constructor
 */
export function Button(pins, renderer, x, y) {
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
                click.point.x >= x + Button.X_OFFSET &&
                click.point.x < x + Button.X_OFFSET + Button.WIDTH &&
                click.point.y >= y + Button.Y_OFFSET &&
                click.point.y < y + Button.Y_OFFSET + Button.HEIGHT) {
                _pressed = Button.PRESS_TICKS + 1;

                renderer.getSprites()[Button.SPRITE_INDEX_BUTTON].setFrame(Button.SPRITE_FRAME_PRESSED);
            }
        }

        if (_pressed > 0) {
            state[pins[Button.PIN_INDEX_OUT]] = state[pins[Button.PIN_INDEX_IN]];

            if (--_pressed === 0)
                renderer.getSprites()[Button.SPRITE_INDEX_BUTTON].setFrame(Button.SPRITE_FRAME_RELEASED);
        }
        else
            state[pins[Button.PIN_INDEX_OUT]] = 0;
    };
}

Button.X_OFFSET = 0;
Button.Y_OFFSET = -1;
Button.WIDTH = 2;
Button.HEIGHT = 2;
Button.PRESS_TICKS = 3;
Button.SPRITE_INDEX_BUTTON = 1;
Button.SPRITE_FRAME_RELEASED = 0;
Button.SPRITE_FRAME_PRESSED = 1;
Button.PIN_INDEX_IN = 0;
Button.PIN_INDEX_OUT = 1;