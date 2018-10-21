import {View} from "../../view/view";
import {ZoomProfile} from "../../view/zoomProfile";
import {ShiftProfile} from "../../view/shiftProfile";
import {EditorOutput} from "./editorOutput";
import {EditorInput} from "./editorInput";
import {MouseEvent} from "../../input/mouse/MouseEvent";
import * as Myr from "../../../lib/myr";

/**
 * Provides am editor for editing PCB's.
 * @param {RenderContext} renderContext A render context.
 * @param {World} world A world instance to interact with.
 * @param {Game} game A game.
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
     * @param {Editable} editable An editable.
     */
    this.edit = editable => _input.edit(editable);

    /**
     * Hide the editor.
     */
    this.hide = () => {
        _output.hide();
        _input.hide();
    };

    /**
     * Show the editor.
     */
    this.show = () => {
        _input.show();
        _output.show();
    };

    /**
     * Call after the render context has resized.
     * @param {Number} width The width in pixels.
     * @param {Number} height The height in pixels.
     */
    this.resize = (width, height) => {
        _view.resize(width - renderContext.getViewport().getSplitX(), height);
    };

    /**
     * Update the state of the editor.
     * @param {Number} timeStep The number of seconds passed after the previous update.
     */
    this.update = timeStep => {
        _output.update(timeStep);
        _input.update(timeStep);
    };

    /**
     * Render the editor.
     */
    this.draw = () => {
        _input.draw();
    };

    /**
     * A mouse event has been fired.
     * @param {MouseEvent} event A mouse event.
     */
    this.onMouseEvent = event => {
        switch (event.type) {
            case MouseEvent.EVENT_PRESS_LMB:
                _input.onMousePress(event.x - renderContext.getViewport().getSplitX(), event.y);

                break;
            case MouseEvent.EVENT_RELEASE_LMB:
                _input.onMouseRelease();

                break;
            case MouseEvent.EVENT_SCROLL:
                if (event.wheelDelta > 0)
                    _input.zoomIn(event.x - renderContext.getViewport().getSplitX(), event.y);
                else
                    _input.zoomOut(event.x - renderContext.getViewport().getSplitX(), event.y);

                break;
            case MouseEvent.EVENT_ENTER:
                _input.onMouseEnter(event.x - renderContext.getViewport().getSplitX(), event.y);

                break;
            case MouseEvent.EVENT_LEAVE:
                _input.onMouseLeave();

                break;
            case MouseEvent.EVENT_MOVE:
                _input.onMouseMove(event.x - renderContext.getViewport().getSplitX(), event.y);

                break;
        }
    };

    /**
     * A key event has been fired.
     * @param {KeyEvent} event A key event.
     */
    this.onKeyEvent = event => _input.onKeyEvent(event);

    /**
     * Free all resources occupied by this editor.
     */
    this.free = () => {
        _input.free();
        _output.free();
    };

    _view.setOnChanged(onViewChanged);
}

Editor.ZOOM_DEFAULT = 4;
Editor.ZOOM_FACTOR = 0.15;
Editor.ZOOM_MIN = 1;
Editor.ZOOM_MAX = 8;