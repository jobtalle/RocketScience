import {PcbEditor} from "./pcbEditor";
import {Library} from "./library";

/**
 * Provides a grid editor.
 * @param {Object} myr A Myriad instance.
 * @param {Object} sprites All sprites.
 * @param {Number} width The width.
 * @param {Number} height The height.
 * @constructor
 */
export function Editor(myr, sprites, width, height) {
    const EDITOR_WIDTH = 0.7;

    const _pcbEditor = new PcbEditor(myr, sprites, Math.floor(width * EDITOR_WIDTH), height);
    const _library = new Library(_pcbEditor, width - _pcbEditor.getWidth());

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
}