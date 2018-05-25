import {PcbEditor} from "./pcbEditor";
import {Library} from "./library";

/**
 * Provides a grid editor.
 * @param {Object} myr A Myriad instance.
 * @param {Object} sprites All sprites.
 * @param {Object} overlay An overlay element for HTML GUI.
 * @param {Number} width The width.
 * @param {Number} height The height.
 * @constructor
 */
export function Editor(myr, sprites, overlay, width, height) {
    const EDITOR_WIDTH = 0.7;

    const _pcbEditor = new PcbEditor(myr, sprites, Math.floor(width * EDITOR_WIDTH), height);
    const _library = new Library(_pcbEditor, overlay, width - _pcbEditor.getWidth());

    /**
     * Start editing a pcb.
     * @param {Object} pcb A pcb instance to edit.
     */
    this.edit = pcb => {
        _pcbEditor.edit(pcb);
    };

    /**
     * Update the state of the editor.
     * @param {Number} timeStep The number of seconds passed after the previous update.
     */
    this.update = timeStep => {
        _pcbEditor.update(timeStep);
    };

    /**
     * Render the editor.
     */
    this.draw = () => {
        _pcbEditor.draw(_library.getWidth());
    };

    /**
     * Press the mouse.
     * @param {Number} x The mouse x position in pixels.
     * @param {Number} y The mouse y position in pixels.
     */
    this.onMousePress = (x, y) => {
        _pcbEditor.onMousePress(x -_library.getWidth(), y);
    };

    /**
     * Release the mouse.
     * @param {Number} x The mouse x position in pixels.
     * @param {Number} y The mouse y position in pixels.
     */
    this.onMouseRelease = (x, y) => {
        _pcbEditor.onMouseRelease(x - _library.getWidth(), y);
    };

    /**
     * Move the mouse.
     * @param {Number} x The mouse x position in pixels.
     * @param {Number} y The mouse y position in pixels.
     */
    this.onMouseMove = (x, y) => {
        _pcbEditor.onMouseMove(x - _library.getWidth(), y);
    };


    /**
     * A key is pressed.
     * @param {String} key A key.
     */
    this.onKeyDown = key => {
        _pcbEditor.onKeyDown(key);
    };
}