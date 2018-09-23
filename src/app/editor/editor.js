import {View} from "../view/view";
import {ZoomProfile} from "../view/zoomProfile";
import {ShiftProfile} from "../view/shiftProfile";
import {Viewport} from "./viewport";
import {EditorOutput} from "./output/editorOutput";
import {EditorInput} from "./input/editorInput";
import * as Myr from "../../lib/myr";

/**
 * Provides a grid editor.
 * @param {RenderContext} renderContext A render context.
 * @param {World} world A world instance to interact with.
 * @param {Object} game An interface to interact with the game object.
 * @constructor
 */
export function Editor(renderContext, world, game) {
    const _view = new View(
        renderContext.getWidth() - renderContext.getViewport().getSplitX(),
        renderContext.getHeight(),
        new ZoomProfile(
            ZoomProfile.TYPE_ROUND,
            Editor.ZOOM_FACTOR,
            Editor.ZOOM_DEFAULT,
            Editor.ZOOM_MIN,
            Editor.ZOOM_MAX),
        new ShiftProfile(1));
    const _output = new EditorOutput(renderContext);
    const _input = new EditorInput(renderContext, _output, world, _view, game);

    let _editorHover = false;
    let _pcbScreenPosition = new Myr.Vector(0, 0);

    const onViewChanged = () => {
        _pcbScreenPosition.x = 0;
        _pcbScreenPosition.y = 0;

        _view.getInverse().apply(_pcbScreenPosition);
        _output.getOverlay().move(
            -_pcbScreenPosition.x,
            -_pcbScreenPosition.y,
            _view.getZoom());
    };

    /**
     * Start editing a pcb.
     * @param {Pcb} pcb A pcb instance to edit.
     * @param {Number} x The X position in the world in meters.
     * @param {Number} y The Y position in the world in meters.
     */
    this.edit = (pcb, x, y) => {
        _input.getPcbEditor().edit(pcb, x, y);
        _input.getToolbar().default();
    };

    /**
     * Hide the editor
     */
    this.hide = () => {
        _output.getOverlay().hide();
        _input.getPcbEditor().hide();
        _input.getLibrary().hide();
        _input.getToolbar().hide();
    };

    /**
     * Show the editor.
     */
    this.show = () => {
        _output.getOverlay().show();
        _input.getPcbEditor().show();
        _input.getLibrary().show();
        _input.getToolbar().show();
    };

    /**
     * Update the state of the editor.
     * @param {Number} timeStep The number of seconds passed after the previous update.
     */
    this.update = timeStep => {
        _input.getPcbEditor().update(timeStep);
    };

    /**
     * Render the editor.
     */
    this.draw = () => {
        _input.getPcbEditor().draw(_input.getLibrary().getWidth());
    };

    /**
     * Press the mouse.
     */
    this.onMousePress = () => {
        _input.getPcbEditor().onMousePress();
    };

    /**
     * Release the mouse.
     */
    this.onMouseRelease = () => {
        _input.getPcbEditor().onMouseRelease();
    };

    /**
     * Move the mouse.
     * @param {Number} x The mouse x position in pixels.
     * @param {Number} y The mouse y position in pixels.
     */
    this.onMouseMove = (x, y) => {
        if (x <= renderContext.getViewport().getSplitX()) {
            if (_editorHover) {
                _input.getPcbEditor().onMouseLeave();
                _editorHover = false;
            }
        }
        else if (!_editorHover) {
            _input.getPcbEditor().onMouseEnter();
            _editorHover = true;
        }

        _input.getPcbEditor().onMouseMove(x - renderContext.getViewport().getSplitX(), y);
    };

    /**
     * The mouse enters.
     */
    this.onMouseEnter = () => {
        if (!_editorHover) {
            _input.getPcbEditor().onMouseEnter();
            _editorHover = true;
        }
    };

    /**
     * The mouse leaves.
     */
    this.onMouseLeave = () => {
        if (_editorHover) {
            _input.getPcbEditor().onMouseLeave();
            _editorHover = false;
        }
    };

    /**
     * Zoom in.
     */
    this.zoomIn = () => {
        _input.getPcbEditor().zoomIn();
    };

    /**
     * Zoom out.
     */
    this.zoomOut = () => {
        _input.getPcbEditor().zoomOut();
    };

    /**
     * A key is pressed.
     * @param {String} key A key.
     * @param {Boolean} control Indicates whether the control button is pressed.
     */
    this.onKeyDown = (key, control) => {
        _input.getPcbEditor().onKeyDown(key, control);
        _input.getToolbar().onKeyDown(key);
    };

    /**
     * Free all resources occupied by this editor.
     */
    this.free = () => {
        _input.getPcbEditor().free();
    };

    _view.setOnChanged(onViewChanged);
}

Editor.EDITOR_WIDTH = 0.3;
Editor.ZOOM_DEFAULT = 4;
Editor.ZOOM_FACTOR = 0.15;
Editor.ZOOM_MIN = 1;
Editor.ZOOM_MAX = 8;