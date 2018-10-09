/**
 * @param {Array} pins An array containing the pin indices.
 * @param {PartRenderer} renderer A part renderer to render state to.
 * @constructor
 */
export function Controller(pins, renderer) {
    let _controllerState = null;

    /**
     * Initialize the state.
     * @param {Physics} body A physics body to apply state to.
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
        if (state[pins[Controller.PIN_INDEX_POWER]] === 1) {
            state[pins[Controller.PIN_INDEX_LEFT]] = _controllerState.getKeyLeft()?1:0;
            state[pins[Controller.PIN_INDEX_UP]] = _controllerState.getKeyUp()?1:0;
            state[pins[Controller.PIN_INDEX_RIGHT]] = _controllerState.getKeyRight()?1:0;
            state[pins[Controller.PIN_INDEX_DOWN]] = _controllerState.getKeyDown()?1:0;
        }
        else {
            state[pins[Controller.PIN_INDEX_LEFT]] = 0;
            state[pins[Controller.PIN_INDEX_UP]] = 0;
            state[pins[Controller.PIN_INDEX_RIGHT]] = 0;
            state[pins[Controller.PIN_INDEX_DOWN]] = 0;
        }
    };
}

Controller.PIN_INDEX_POWER = 0;
Controller.PIN_INDEX_LEFT = 1;
Controller.PIN_INDEX_UP = 2;
Controller.PIN_INDEX_RIGHT = 3;
Controller.PIN_INDEX_DOWN = 4;