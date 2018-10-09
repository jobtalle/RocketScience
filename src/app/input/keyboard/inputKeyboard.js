import {KeyEvent} from "./keyEvent";

/**
 * This object handles keyboard input events.
 * @param {Window} window The window to listen for keyboard input on.
 * @constructor
 */
export function InputKeyboard(window) {
    const listeners = [];

    let control = false;
    let shift = false;

    const fireEvent = (key, down) => {
        const keyEvent = new KeyEvent(key, down, shift, control);

        for (const listener of listeners)
            listener.onKeyDown(keyEvent);
    };

    const onkeydown = event => {
        switch (event.key) {
            case InputKeyboard.KEY_CONTROL:
                control = true;
                break;
            case InputKeyboard.KEY_SHIFT:
                shift = true;
                break;
            default:
                fireEvent(event.key, true);
        }
    };

    const onkeyup = event => {
        switch (event.key) {
            case InputKeyboard.KEY_CONTROL:
                control = false;
                break;
            case InputKeyboard.KEY_SHIFT:
                shift = false;
                break;
            default:
                fireEvent(event.key, false);
        }
    };

    /**
     * Add a listener to this object.
     * The function onKeyEvent(event) will be called on the listener for key events.
     * @param {Object} listener A listener with a function called onKeyEvent.
     */
    this.addListener = listener => listeners.push(listener);

    /**
     * Remove a listener from this object.
     * @param {Object} listener A listener previously added through the addListener method.
     */
    this.removeListener = listener => listeners.splice(listeners.indexOf(listener), 1);

    window.onkeydown = onkeydown;
    window.onkeyup = onkeyup;
}

InputKeyboard.KEY_CONTROL = "Control";
InputKeyboard.KEY_SHIFT = "Shift";