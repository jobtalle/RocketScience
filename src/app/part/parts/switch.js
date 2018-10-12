/**
 * A switch that can be toggled.
 * @param {Array} pins An array containing the pin indices.
 * @param {PartRenderer} renderer A part renderer to render state to.
 * @param {Number} x The x position on the board.
 * @param {Number} y The y position on the board.
 * @constructor
 */
export function Switch(pins, renderer, x, y) {
    let _body = null;
    let _controllerState = null;
    let _toggled = 0;

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
                click.point.x >= x + Switch.X_OFFSET &&
                click.point.x < x + Switch.X_OFFSET + Switch.WIDTH &&
                click.point.y >= y + Switch.Y_OFFSET &&
                click.point.y < y + Switch.Y_OFFSET + Switch.HEIGHT) {
                _toggled = 1 - _toggled;

                renderer.getSprites()[Switch.SPRITE_INDEX_BUTTON].setFrame(_toggled);
            }
        }

        if (_toggled === 1)
            state[pins[Switch.PIN_INDEX_OUT]] = state[pins[Switch.PIN_INDEX_IN]];
        else
            state[pins[Switch.PIN_INDEX_OUT]] = 0;
    };
}

Switch.X_OFFSET = 0;
Switch.Y_OFFSET = -1;
Switch.WIDTH = 2;
Switch.HEIGHT = 2;
Switch.SPRITE_INDEX_BUTTON = 1;
Switch.PIN_INDEX_IN = 0;
Switch.PIN_INDEX_OUT = 1;