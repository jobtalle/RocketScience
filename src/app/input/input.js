/**
 * Any non-HTML input is caught & handled by this object.
 * This entails keyboard and gamepad input.
 * @param {Window} window The window to listen for keyboard input on.
 * @constructor
 */
import {InputKeyboard} from "./keyboard/inputKeyboard";

export function Input(window) {
    const keyboard = new InputKeyboard(window);

    /**
     * Get the keyboard input object.
     * @returns {InputKeyboard} The keyboard input object.
     */
    this.getKeyboard = () => keyboard;
}