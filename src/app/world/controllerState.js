/**
 * The state of controllers used by the player.
 * @constructor
 */
export function ControllerState() {
    let _left = false;
    let _up = false;
    let _right = false;
    let _down = false;

    /**
     * A key event has been fired.
     * @param {KeyEvent} event A key event.
     */
    this.onKeyEvent = event => {
        switch (event.key) {
            case ControllerState.KEY_LEFT:
                _left = event.down;

                break;
            case ControllerState.KEY_UP:
                _up = event.down;

                break;
            case ControllerState.KEY_RIGHT:
                _right = event.down;

                break;
            case ControllerState.KEY_DOWN:
                _down = event.down;

                break;
        }
    };

    /**
     * Check whether the controller steers left.
     * @returns {Boolean} A boolean indicating whether the controller steers left.
     */
    this.getKeyLeft = () => _left;

    /**
     * Check whether the controller steers up.
     * @returns {Boolean} A boolean indicating whether the controller steers up.
     */
    this.getKeyUp = () => _up;

    /**
     * Check whether the controller steers right.
     * @returns {Boolean} A boolean indicating whether the controller steers right.
     */
    this.getKeyRight = () => _right;

    /**
     * Check whether the controller steers down.
     * @returns {Boolean} A boolean indicating whether the controller steers down.
     */
    this.getKeyDown = () => _down;
}

ControllerState.KEY_LEFT = "Left";
ControllerState.KEY_UP = "Up";
ControllerState.KEY_RIGHT = "Right";
ControllerState.KEY_DOWN = "Down";