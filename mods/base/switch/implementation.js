/**
 * A switch that can be toggled.
 * @param {Object} context An object containing the game context, and references to some important utils.
 * @constructor
 */
function Switch(context) {
    const X_OFFSET = 0;
    const Y_OFFSET = -1;
    const WIDTH = 2;
    const HEIGHT = 2;
    const SPRITE_INDEX_BUTTON = 1;
    const PIN_INDEX_OUT = 0;

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
                click.point.x >= context.x + X_OFFSET &&
                click.point.x < context.x + X_OFFSET + WIDTH &&
                click.point.y >= context.y + Y_OFFSET &&
                click.point.y < context.y + Y_OFFSET + HEIGHT) {
                _toggled = 1 - _toggled;

                context.renderer.getSprites()[SPRITE_INDEX_BUTTON].setFrame(_toggled);
            }
        }

        if (_toggled === 1)
            state[context.pins[PIN_INDEX_OUT]] = 1;
        else
            state[context.pins[PIN_INDEX_OUT]] = 0;
    };
}
