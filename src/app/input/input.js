import {InputKeyboard} from "./keyboard/inputKeyboard";
import {InputMouse} from "./mouse/inputMouse";

/**
 * Any non-HTML input is caught & handled by this object.
 * This entails keyboard and gamepad input.
 * @param {Window} window The window to listen for keyboard input on.
 * @param {RenderContext} renderContext A render context.
 * @constructor
 */
export function Input(window, renderContext) {
    const _keyboard = new InputKeyboard(window);
    const _mouse = new InputMouse(renderContext.getOverlay());

    /**
     * Get the keyboard input object.
     * @returns {InputKeyboard} The keyboard input object.
     */
    this.getKeyboard = () => _keyboard;

    /**
     * Get the mouse input object.
     * @returns {InputMouse} The mouse input object.
     */
    this.getMouse = () => _mouse;
}