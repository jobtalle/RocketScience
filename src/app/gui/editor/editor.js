import {View} from "../../view/view";
import {ZoomProfile} from "../../view/zoomProfile";
import {ShiftProfile} from "../../view/shiftProfile";
import {MouseEvent} from "../../input/mouse/mouseEvent";
import {PcbEditor} from "./pcb/pcbEditor";
import {Toolbar} from "./toolbar/toolbar";
import {Library} from "./library/library";
import {Overlay} from "./overlay/overlay";
import {Info} from "./info/info";
import {PartSummary} from "../../pcb/partSummary";
import {Scale} from "../../world/scale";
import {Editables} from "./editables";
import {Checklist} from "../shared/checklist/checklist";
import Myr from "myr.js"
import {Data} from "../../file/data";
import {DownloadBinary} from "../../utils/downloadBinary";
import {Tabbar} from "./tabbar/tabbar";

/**
 * Provides am editor for editing PCB's.
 * @param {RenderContext} renderContext A render context.
 * @param {World} world A world instance to interact with.
 * @param {Game} game A game.
 * @param {Boolean} isMissionEditor Shows whether the editor should show functionality for editing missions.
 * @constructor
 */
export function Editor(renderContext, world, game, isMissionEditor) {
    const _overlay = new Overlay(renderContext.getViewport().getElement(), renderContext.getViewport().getSplitX());
    const _info = new Info(_overlay);
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
    const _pcbEditor = new PcbEditor(
        renderContext,
        world,
        _view,
        renderContext.getWidth() - renderContext.getViewport().getSplitX(),
        renderContext.getHeight(),
        renderContext.getViewport().getSplitX(),
        this,
        isMissionEditor);
    const _editables = new Editables(this, renderContext, world);
    const _toolbar = new Toolbar(
        _pcbEditor,
        _editables,
        renderContext.getViewport().getElement(),
        renderContext.getViewport().getSplitX(),
        game,
        isMissionEditor);
    const _library = new Library(
        _pcbEditor,
        _toolbar,
        _info,
        renderContext.getViewport().getElement(),
        isMissionEditor);
    const _checklist = new Checklist(
        world.getMission(),
        game,
        isMissionEditor);
    const _tabbar = new Tabbar(
        _pcbEditor,
        renderContext.getViewport().getElement(),
        renderContext.getViewport().getSplitX(),
        world,
        isMissionEditor);

    const _pcbScreenPosition = new Myr.Vector(0, 0);
    let _editable = null;

    const onViewChanged = () => {
        _pcbScreenPosition.x = 0;
        _pcbScreenPosition.y = 0;

        _view.getInverse().apply(_pcbScreenPosition);
        _overlay.move(
            -_pcbScreenPosition.x,
            -_pcbScreenPosition.y,
            _view.getZoom());
    };

    /**
     * Get the info output GUI.
     * @returns {Info} The Info object.
     */
    this.getInfo = () => _info;

    /**
     * Get the overlay output GUI.
     * @returns {Overlay} The Overlay object.
     */
    this.getOverlay = () => _overlay;

    /**
     * Check if anything is edited.
     * @return {Boolean} A boolean indicating if the editables are edited.
     */
    this.isEdited = () => {
        return _editables.isEdited();
    };

    /**
     * The PCB has changed.
     */
    this.onPcbChange = () => {
        if (_editable.getBudget())
            _library.setBudget(_editable.getBudget(), new PartSummary(_editable.getPcb()));
        else
            _library.setBudget(_editable.getBudget(), null);
    };

    /**
     * Start editing a pcb.
     * @param {Editable} editable An editable.
     */
    this.edit = editable => {
        if (_editable) {
            const delta = _editable.getRegion().getOrigin().copy();

            delta.add(_editable.getOffset());
            delta.subtract(editable.getRegion().getOrigin());
            delta.subtract(editable.getOffset());

            _view.focus(
                _view.getFocusX() + delta.x * Scale.PIXELS_PER_METER,
                _view.getFocusY() + delta.y * Scale.PIXELS_PER_METER,
                _view.getZoom());
        }

        _editable = editable;
        _editables.setCurrent(editable);
        _pcbEditor.edit(editable);
        _toolbar.default();
    };

    /**
     * Get the currently selected editable.
     * @returns {Editable} An editable, or null if none is selected.
     */
    this.getEditable = () => _editable;

    /**
     * Get all editables.
     * @returns {Array} An array of editables.
     */
    this.getEditables = () => world.getMission().getEditables();

    /**
     * Hide the editor.
     */
    this.hide = () => {
        _toolbar.hide();
        _library.hide();
        _pcbEditor.hide();
        _overlay.hide();
        _tabbar.hide();

        renderContext.getOverlay().removeChild(_checklist.getElement());
    };

    /**
     * Show the editor.
     */
    this.show = () => {
        _pcbEditor.show();
        _library.show();
        _toolbar.show();
        _overlay.show();
        _tabbar.show();

        if (!isMissionEditor && world.getMission().isFinished())
            _checklist.finish();

        renderContext.getOverlay().appendChild(_checklist.getElement());
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
        _pcbEditor.update(timeStep);
    };

    /**
     * Render the editor.
     */
    this.draw = () => {
        renderContext.getMyr().push();
        renderContext.getMyr().transform(world.getView().getTransform());

        _editables.draw();

        renderContext.getMyr().pop();

        _pcbEditor.draw();
    };

    /**
     * A mouse event has been fired.
     * @param {MouseEvent} event A mouse event.
     */
    this.onMouseEvent = event => {
        switch (event.type) {
            case MouseEvent.EVENT_PRESS_LMB:
            case MouseEvent.EVENT_PRESS_RMB:
                const pressedEditable = _editables.getEditableAt(event.x, event.y);
                const isCam = event.type === Editor.MOUSE_BUTTON_PRESS_VIEW;

                if (isCam || !pressedEditable || pressedEditable === _editable)
                    _pcbEditor.onMousePress(
                        event.x - renderContext.getViewport().getSplitX(),
                        event.y,
                        isCam);
                else {
                    _pcbEditor.setEditMode(PcbEditor.EDIT_MODE_SELECT);

                    this.edit(pressedEditable);
                }

                break;
            case MouseEvent.EVENT_RELEASE_LMB:
            case MouseEvent.EVENT_RELEASE_RMB:
                _pcbEditor.onMouseRelease(
                    event.x - renderContext.getViewport().getSplitX(),
                    event.y,
                    event.type === Editor.MOUSE_BUTTON_RELEASE_VIEW);

                break;
            case MouseEvent.EVENT_SCROLL:
                if (event.wheelDelta > 0)
                    _pcbEditor.zoomIn(event.x - renderContext.getViewport().getSplitX(), event.y);
                else
                    _pcbEditor.zoomOut(event.x - renderContext.getViewport().getSplitX(), event.y);

                break;
            case MouseEvent.EVENT_ENTER:
                _pcbEditor.onMouseEnter(event.x - renderContext.getViewport().getSplitX(), event.y);

                break;
            case MouseEvent.EVENT_LEAVE:
                _pcbEditor.onMouseLeave();

                break;
            case MouseEvent.EVENT_MOVE:
                _pcbEditor.onMouseMove(event.x - renderContext.getViewport().getSplitX(), event.y);

                break;
        }
    };

    /**
     * A key event has been fired.
     * @param {KeyEvent} event A key event.
     */
    this.onKeyEvent = event => {
        _toolbar.onKeyEvent(event);
        _pcbEditor.onKeyEvent(event);

        // TODO: REMOVE THIS
        if (event.down) switch(event.key) {
            case Editor.KEY_MISSION_DOWNLOAD:
                const missionData = new Data();

                world.getMission().serialize(missionData.getBuffer());

                DownloadBinary(missionData.getBlob(), world.getMission().getTitle() + ".bin");

                return;
        }
    };

    /**
     * Free all resources occupied by this editor.
     */
    this.free = () => {
        _pcbEditor.free();
        _editables.free();
    };

    _view.setOnChanged(onViewChanged);
}

Editor.ZOOM_DEFAULT = 4;
Editor.ZOOM_FACTOR = 0.15;
Editor.ZOOM_MIN = 1;
Editor.ZOOM_MAX = 16;
Editor.KEY_MISSION_DOWNLOAD = "m";
Editor.MOUSE_BUTTON_PRESS_VIEW = MouseEvent.EVENT_PRESS_RMB;
Editor.MOUSE_BUTTON_RELEASE_VIEW = MouseEvent.EVENT_RELEASE_RMB;