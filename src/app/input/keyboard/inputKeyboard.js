import {KeyEvent} from "./keyEvent";

/**
 * This object handles keyboard input events.
 * @param {Window} window The window to listen for keyboard input on.
 * @constructor
 */
export function InputKeyboard(window) {
    const _listeners = [];
    const _down = {};

    let _control = false;
    let _shift = false;

    const fireEvent = (key, down) => {
        const keyEvent = new KeyEvent(key, down, _shift, _control);

        for (const listener of _listeners)
            listener(keyEvent);
    };

    const onkeydown = event => {
        if (_down[event.key])
            return;

        _down[event.key] = true;

        switch (event.key) {
            case InputKeyboard.KEY_CONTROL:
                _control = true;
                break;
            case InputKeyboard.KEY_SHIFT:
                _shift = true;
                break;
            default:
                fireEvent(event.key, true);
        }
    };

    const onkeyup = event => {
        _down[event.key] = false;

        switch (event.key) {
            case InputKeyboard.KEY_CONTROL:
                _control = false;
                break;
            case InputKeyboard.KEY_SHIFT:
                _shift = false;
                break;
            default:
                fireEvent(event.key, false);
        }
    };

    /**
     * Add a listener to this object.
     * @param {Function} listener A function to be called on key events.
     */
    this.addListener = listener => _listeners.push(listener);

    /**
     * Remove a listener from this object.
     * @param {Function} listener A listener previously added through the addListener method.
     */
    this.removeListener = listener => _listeners.splice(_listeners.indexOf(listener), 1);

    window.onkeydown = onkeydown;
    window.onkeyup = onkeyup;
}

InputKeyboard.KEY_CONTROL = "Control";
InputKeyboard.KEY_SHIFT = "Shift";