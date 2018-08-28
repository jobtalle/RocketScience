import {PcbEditor} from "./pcb/pcbEditor";
import {Library} from "./library/library";
import {Toolbar} from "./toolbar/toolbar";

/**
 * Provides a grid editor.
 * @param {Myr} myr A Myriad instance.
 * @param {Sprites} sprites All sprites.
 * @param {Object} overlay An overlay element for HTML GUI.
 * @param {World} world A world instance to interact with.
 * @param {Number} width The width.
 * @param {Number} height The height.
 * @param {Object} game An interface to interact with the game object.
 * @constructor
 */
export function Editor(myr, sprites, overlay, world, width, height, game) {
    const _pcbEditor = new PcbEditor(
        myr,
        sprites,
        world,
        Math.floor(width * Editor.EDITOR_WIDTH),
        height,
        width - Math.floor(width * Editor.EDITOR_WIDTH));
    const _toolbar = new Toolbar(_pcbEditor, overlay, width - _pcbEditor.getWidth(), game);
    const _library = new Library(_pcbEditor, _toolbar, overlay, width - _pcbEditor.getWidth());

    let _editorHover = false;

    /**
     * Start editing a pcb.
     * @param {Pcb} pcb A pcb instance to edit.
     * @param {Number} x The X position in the world in meters.
     * @param {Number} y The Y position in the world in meters.
     */
    this.edit = (pcb, x, y) => {
        _pcbEditor.edit(pcb, x, y);
        _toolbar.default();
    };

    /**
     * Hide the editor
     */
    this.hide = () => {
        _pcbEditor.hide();
        _library.hide();
        _toolbar.hide();
    };

    /**
     * Show the editor.
     */
    this.show = () => {
        _pcbEditor.show();
        _library.show();
        _toolbar.show();
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
        if (x <= _library.getWidth()) {
            if (_editorHover) {
                _pcbEditor.onMouseLeave();
                _editorHover = false;
            }
        }
        else if (!_editorHover) {
            _pcbEditor.onMouseEnter();
            _editorHover = true;
        }

        _pcbEditor.onMouseMove(x - _library.getWidth(), y);
    };

    /**
     * The mouse enters.
     */
    this.onMouseEnter = () => {
        if (!_editorHover) {
            _pcbEditor.onMouseEnter();
            _editorHover = true;
        }
    };

    /**
     * The mouse leaves.
     */
    this.onMouseLeave = () => {
        if (_editorHover) {
            _pcbEditor.onMouseLeave();
            _editorHover = false;
        }
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
        _toolbar.onKeyDown(key, control);
    };

    /**
     * Free all resources occupied by this editor.
     */
    this.free = () => {
        _pcbEditor.free();
    };
}

Editor.EDITOR_WIDTH = 0.7;