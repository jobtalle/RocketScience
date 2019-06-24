/**
 * A controller chip, which conveys keyboard or gamepad controls to a pcb through its pins.
 * @param {Array} pins An array containing the pin indices.
 * @param {PartRenderer} renderer A part renderer to render state to.
 * @constructor
 */
function Controller(context) {
    let _controllerState = null;

    const PIN_INDEX_POWER = 0;
    const PIN_INDEX_ACTION_1 = 1;
    const PIN_INDEX_ACTION_2 = 2;
    const PIN_INDEX_ACTION_3 = 3;
    const PIN_INDEX_LEFT = 4;
    const PIN_INDEX_UP = 5;
    const PIN_INDEX_RIGHT = 6;
    const PIN_INDEX_DOWN = 7;

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
        if (state[context.pins[PIN_INDEX_POWER]] === 1) {
            state[context.pins[PIN_INDEX_ACTION_1]] = _controllerState.getKeyAction1()?1:0;
            state[context.pins[PIN_INDEX_ACTION_2]] = _controllerState.getKeyAction2()?1:0;
            state[context.pins[PIN_INDEX_ACTION_3]] = _controllerState.getKeyAction3()?1:0;
            state[context.pins[PIN_INDEX_LEFT]] = _controllerState.getKeyLeft()?1:0;
            state[context.pins[PIN_INDEX_UP]] = _controllerState.getKeyUp()?1:0;
            state[context.pins[PIN_INDEX_RIGHT]] = _controllerState.getKeyRight()?1:0;
            state[context.pins[PIN_INDEX_DOWN]] = _controllerState.getKeyDown()?1:0;
        }
        else {
            state[context.pins[PIN_INDEX_ACTION_1]] = 0;
            state[context.pins[PIN_INDEX_ACTION_2]] = 0;
            state[context.pins[PIN_INDEX_ACTION_3]] = 0;
            state[context.pins[PIN_INDEX_LEFT]] = 0;
            state[context.pins[PIN_INDEX_UP]] = 0;
            state[context.pins[PIN_INDEX_RIGHT]] = 0;
            state[context.pins[PIN_INDEX_DOWN]] = 0;
        }
    };
}