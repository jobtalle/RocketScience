/**
 * The state of controllers used by the player.
 * @constructor
 */
export function ControllerState() {
    const Click = function(target, point) {
        this.target = target;
        this.point = point;
    };

    let _state = 0;
    let _postponedRelease = 0;
    let _clicks = [];

    const press = key => {
        switch (key) {
            case ControllerState.KEY_ACTION_1:
                _state |= ControllerState.FLAG_ACTION_1;
                _postponedRelease &= ~ControllerState.FLAG_ACTION_1;

                break;
            case ControllerState.KEY_ACTION_2:
                _state |= ControllerState.FLAG_ACTION_2;
                _postponedRelease &= ~ControllerState.FLAG_ACTION_2;

                break;
            case ControllerState.KEY_ACTION_3:
                _state |= ControllerState.FLAG_ACTION_3;
                _postponedRelease &= ~ControllerState.FLAG_ACTION_3;

                break;
            case ControllerState.KEY_LEFT:
                _state |= ControllerState.FLAG_LEFT;

                break;
            case ControllerState.KEY_UP:
                _state |= ControllerState.FLAG_UP;

                break;
            case ControllerState.KEY_RIGHT:
                _state |= ControllerState.FLAG_RIGHT;

                break;
            case ControllerState.KEY_DOWN:
                _state |= ControllerState.FLAG_DOWN;

                break;
        }
    };

    const release = key => {
        switch (key) {
            case ControllerState.KEY_ACTION_1:
                _postponedRelease |= ControllerState.FLAG_ACTION_1;

                break;
            case ControllerState.KEY_ACTION_2:
                _postponedRelease |= ControllerState.FLAG_ACTION_2;

                break;
            case ControllerState.KEY_ACTION_3:
                _postponedRelease |= ControllerState.FLAG_ACTION_3;

                break;
            case ControllerState.KEY_LEFT:
                _state &= ~ControllerState.FLAG_LEFT;

                break;
            case ControllerState.KEY_UP:
                _state &= ~ControllerState.FLAG_UP;

                break;
            case ControllerState.KEY_RIGHT:
                _state &= ~ControllerState.FLAG_RIGHT;

                break;
            case ControllerState.KEY_DOWN:
                _state &= ~ControllerState.FLAG_DOWN;

                break;
        }
    };

    /**
     * A key event has been fired.
     * @param {KeyEvent} event A key event.
     */
    this.onKeyEvent = event => {
        if (event.down)
            press(event.key);
        else
            release(event.key);
    };

    /**
     * Register a click on an object at a certain position.
     * @param {Object} target The objects' physics body.
     * @param {Myr.Vector} point The clicked pcb point position on the board.
     */
    this.onClick = (target, point) => _clicks.push(new Click(target, point));

    /**
     * Get all clicks registered since the last tick.
     * Each tick has a target member which is the physics body of the clicked object,
     * and a point member which is a Myr.Vector pointing to the clicked point.
     * @returns {Array} An array of clicks.
     */
    this.getClicks = () => _clicks;

    /**
     * Call this function after all parts depending on this controller have ticked.
     */
    this.tick = () => {
        _state &= ~_postponedRelease;
        _postponedRelease = 0;
        _clicks.splice(0, _clicks.length);
    };

    /**
     * Check whether action key 1 is pressed.
     * @returns {Boolean} A boolean indicating whether action key 1 is pressed.
     */
    this.getKeyAction1 = () => (_state & ControllerState.FLAG_ACTION_1) === ControllerState.FLAG_ACTION_1;

    /**
     * Check whether action key 2 is pressed.
     * @returns {Boolean} A boolean indicating whether action key 2 is pressed.
     */
    this.getKeyAction2 = () => (_state & ControllerState.FLAG_ACTION_2) === ControllerState.FLAG_ACTION_2;

    /**
     * Check whether action key 3 is pressed.
     * @returns {Boolean} A boolean indicating whether action key 3 is pressed.
     */
    this.getKeyAction3 = () => (_state & ControllerState.FLAG_ACTION_3) === ControllerState.FLAG_ACTION_3;

    /**
     * Check whether the controller steers left.
     * @returns {Boolean} A boolean indicating whether the controller steers left.
     */
    this.getKeyLeft = () => (_state & ControllerState.FLAG_LEFT) === ControllerState.FLAG_LEFT;

    /**
     * Check whether the controller steers up.
     * @returns {Boolean} A boolean indicating whether the controller steers up.
     */
    this.getKeyUp = () => (_state & ControllerState.FLAG_UP) === ControllerState.FLAG_UP;

    /**
     * Check whether the controller steers right.
     * @returns {Boolean} A boolean indicating whether the controller steers right.
     */
    this.getKeyRight = () => (_state & ControllerState.FLAG_RIGHT) === ControllerState.FLAG_RIGHT;

    /**
     * Check whether the controller steers down.
     * @returns {Boolean} A boolean indicating whether the controller steers down.
     */
    this.getKeyDown = () => (_state & ControllerState.FLAG_DOWN) === ControllerState.FLAG_DOWN;
}

ControllerState.FLAG_LEFT = 0x01;
ControllerState.FLAG_UP = 0x02;
ControllerState.FLAG_RIGHT = 0x04;
ControllerState.FLAG_DOWN = 0x08;
ControllerState.FLAG_ACTION_1 = 0x10;
ControllerState.FLAG_ACTION_2 = 0x20;
ControllerState.FLAG_ACTION_3 = 0x40;

ControllerState.KEY_LEFT = "a";
ControllerState.KEY_UP = "w";
ControllerState.KEY_RIGHT = "d";
ControllerState.KEY_DOWN = "s";
ControllerState.KEY_ACTION_1 = "e";
ControllerState.KEY_ACTION_2 = "f";
ControllerState.KEY_ACTION_3 = "g";