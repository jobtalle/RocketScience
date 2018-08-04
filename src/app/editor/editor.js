import {PcbEditor} from "./pcbEditor";
import {Library} from "./library";

/**
 * Provides a grid editor.
 * @param {Myr} myr A Myriad instance.
 * @param {Sprites} sprites All sprites.
 * @param {Object} overlay An overlay element for HTML GUI.
 * @param {World} world A world instance to interact with.
 * @param {Number} width The width.
 * @param {Number} height The height.
 * @constructor
 */
export function Editor(myr, sprites, overlay, world, width, height) {
    const EDITOR_WIDTH = 0.7;

    const _pcbEditor = new PcbEditor(
        myr,
        sprites,
        world,
        Math.floor(width * EDITOR_WIDTH),
        height,
        width - Math.floor(width * EDITOR_WIDTH));
    const _library = new Library(sprites, _pcbEditor, overlay, width - _pcbEditor.getWidth());

    /**
     * Start placing a part.
     * @param {Object} part The part's constructor.
     */
    this.place = part => {
        _pcbEditor.place(part);
    };

    /**
     * Start editing a pcb.
     * @param {Pcb} pcb A pcb instance to edit.
     * @param {Number} x The X position in the world in meters.
     * @param {Number} y The Y position in the world in meters.
     */
    this.edit = (pcb, x, y) => {
        _pcbEditor.edit(pcb, x, y);
    };

    /**
     * Hide the editor
     */
    this.hide = () => {
        _pcbEditor.hide();
        _library.hide();
    };

    /**
     * Show the editor.
     */
    this.show = () => {
        _pcbEditor.show();
        _library.show();
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
     */
    this.onMousePress = () => {
        _pcbEditor.onMousePress();
    };

    /**
     * Release the mouse.
     */
    this.onMouseRelease = () => {
        _pcbEditor.onMouseRelease();
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
     * Zoom in.
     */
    this.zoomIn = () => {
        _pcbEditor.zoomIn();
    };

    /**
     * Zoom out.
     */
    this.zoomOut = () => {
        _pcbEditor.zoomOut();
    };

    /**
     * A key is pressed.
     * @param {String} key A key.
     * @param {Boolean} control Indicates whether the control button is pressed.
     */
    this.onKeyDown = (key, control) => {
        _pcbEditor.onKeyDown(key, control);
    };

    /**
     * Free all resources occupied by this editor.
     */
    this.free = () => {
        _pcbEditor.free();
    };
}