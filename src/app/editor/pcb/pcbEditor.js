import {Terrain} from "../../world/terrain/terrain";
import {World} from "../../world/world";
import {Pcb} from "../../pcb/pcb";
import {PcbRenderer} from "../../pcb/pcbRenderer";
import {View} from "../../view/view";
import {PcbEditorPlace} from "./pcbEditorPlace";
import {PcbEditorSelect} from "./pcbEditorSelect";
import {PcbEditorReshape} from "./pcbEditorReshape";
import {Selection} from "./selection";
import {PcbEditorEtch} from "./pcbEditorEtch";
import {Editor} from "../editor";
import Myr from "../../../lib/myr.js";

/**
 * The interactive Pcb editor which takes care of sizing & modifying a Pcb.
 * @param {Myr} myr An instance of the Myriad engine.
 * @param {Sprites} sprites All sprites.
 * @param {World} world A world instance to interact with.
 * @param {View} view A View instance.
 * @param {Number} width The editor width.
 * @param {Number} height The editor height.
 * @param {Number} x The X position of the editor view in pixels.
 * @param {Info} info The info object.
 * @param {Overlay} overlay The overlay object.
 * @constructor
 */
export function PcbEditor(myr, sprites, world, view, width, height, x, info, overlay) {
    const State = function(pcb, position) {
        this.getPcb = () => pcb;
        this.getPosition = () => position;
    };

    const KEY_UNDO = "z";
    const KEY_REDO = "y";
    const UNDO_COUNT = 64;

    const _undoStack = [];
    const _redoStack = [];
    const _cursor = new Myr.Vector(-1, -1);
    const _pcbPosition = new Myr.Vector(0, 0);

    let _pcb = null;
    let _renderer = null;
    let _editor = null;
    let _stashedEditor = null;
    let _pressLocation = null;

    const makeInterface = () => {
        return {
            revalidate: revalidate,
            undoPush: undoPush,
            replace: setEditor,
            shift: shift,
            revert: revertEditor,
            info: info,
            overlay: overlay
        };
    };

    const shift = (dx, dy) => {
        _pcbPosition.x += dx * Terrain.METERS_PER_PIXEL;
        _pcbPosition.y += dy * Terrain.METERS_PER_PIXEL;

        view.focus(view.getFocusX() - dx, view.getFocusY() - dy, view.getZoom());

        matchWorldPosition();
    };

    const setEditor = editor => {
        _stashedEditor = _editor;
        _editor = editor;

        moveCursor();
    };

    const matchWorldPosition = () => {
        world.getView().focus(
            view.getFocusX() + _pcbPosition.x * Terrain.PIXELS_PER_METER - x * 0.5 / view.getZoom(),
            view.getFocusY() + _pcbPosition.y * Terrain.PIXELS_PER_METER,
            view.getZoom());
    };

    const revalidate = () => {
        if(_renderer)
            _renderer.revalidate();

        updateCursor();
    };

    const undoPush = () => {
        _undoStack.push(new State(_pcb.copy(), _pcbPosition.copy()));

        if (_undoStack > UNDO_COUNT)
            _undoStack.splice(0, 1);

        _redoStack.length = 0;
    };

    const undoPop = () => {
        const newState = _undoStack.pop();

        if (newState) {
            _redoStack.push(new State(_pcb.copy(), _pcbPosition.copy()));

            this.edit(newState.getPcb(), newState.getPosition().x, newState.getPosition().y);
        }
    };

    const redoPop = () => {
        const newState = _redoStack.pop();

        if (newState) {
            _undoStack.push(new State(_pcb.copy(), _pcbPosition.copy()));

            this.edit(newState.getPcb(), newState.getPosition().x, newState.getPosition().y);
        }
    };

    const updateCursor = () => {
        const oldX = _cursor.x;
        const oldY = _cursor.y;

        _cursor.x = view.getMouse().x;
        _cursor.y = view.getMouse().y;

        view.getInverse().apply(_cursor);

        _cursor.x = Math.floor(_cursor.x / Pcb.PIXELS_PER_POINT);
        _cursor.y = Math.floor(_cursor.y / Pcb.PIXELS_PER_POINT);

        return _cursor.x !== oldX || _cursor.y !== oldY;
    };

    const moveCursor = () => {
        if (!_editor)
            return;

        _editor.moveCursor();
    };

    const mouseDown = () => {
        if (!_editor)
            return false;

        return _editor.mouseDown();
    };

    const mouseUp = () => {
        if (!_editor)
            return;

        _editor.mouseUp();
    };

    const updatePcb = pcb => {
        _pcb = pcb;

        if (_editor)
            _editor.updatePcb(pcb);

        if (_stashedEditor)
            _stashedEditor.updatePcb(pcb);
    };

    const revertEditor = () => {
        setEditor(_stashedEditor);

        return _editor;
    };

    /**
     * Set the editors edit mode. Possible options are:
     * PcbEditor.EDIT_MODE_SELECT  for selection dragging.
     * PcbEditor.EDIT_MODE_RESHAPE for PCB reshaping.
     * @param {Object} mode Any of the valid edit modes.
     */
    this.setEditMode = mode => {
        info.setPinouts(null);
        overlay.clear();

        switch (mode) {
            case PcbEditor.EDIT_MODE_RESHAPE:
                setEditor(new PcbEditorReshape(sprites, _pcb, _cursor, makeInterface()));
                break;
            case PcbEditor.EDIT_MODE_SELECT:
                setEditor(new PcbEditorSelect(sprites, _pcb, _cursor, makeInterface(), new Selection(sprites)));
                break;
            case PcbEditor.EDIT_MODE_ETCH:
                setEditor(new PcbEditorEtch(sprites, _pcb, _cursor, makeInterface()));
                break;
        }
    };

    /**
     * Update the state of the pcb editor.
     * @param timeStep The number of seconds passed after the previous update.
     */
    this.update = timeStep => {
        if (!_editor)
            return;

        _editor.update(timeStep);
    };

    /**
     * Draw the pcb editor.
     */
    this.draw = x => {
        myr.push();
        myr.translate(x, 0);
        myr.transform(view.getTransform());

        _renderer.drawBody(0, 0);
        _editor.draw(myr);

        myr.pop();
    };

    /**
     * Show the pcb editor.
     */
    this.show = () => {
        matchWorldPosition();

        _cursor.x = _cursor.y = -1;

        moveCursor();
    };

    /**
     * Hide the pcb editor.
     */
    this.hide = () => {
        view.onMouseRelease();
        _editor.reset();

        world.addPcb(_pcb, _pcbPosition.x, _pcbPosition.y);
    };

    /**
     * Start placing a part.
     * @param {Array} fixtures An array of valid PcbEditorPlace.Fixture instances to place on the PCB.
     */
    this.place = fixtures => {
        _editor.reset();

        setEditor(new PcbEditorPlace(sprites, _pcb, _cursor, makeInterface(), fixtures, null));
    };

    /**
     * Start editing a pcb.
     * @param {Pcb} pcb A pcb instance to edit.
     * @param {Number} x The X position in the world in meters.
     * @param {Number} y The Y position in the world in meters
     */
    this.edit = (pcb, x, y) => {
        if (_renderer) {
            _renderer.free();

            const dx = (x - _pcbPosition.x) * Terrain.PIXELS_PER_METER;
            const dy = (y - _pcbPosition.y) * Terrain.PIXELS_PER_METER;

            view.focus(
                view.getFocusX() - dx,
                view.getFocusY() - dy,
                view.getZoom());
        }
        else
            view.focus(
                pcb.getWidth() * 0.5 * Pcb.PIXELS_PER_POINT,
                pcb.getHeight() * 0.5 * Pcb.PIXELS_PER_POINT,
                Editor.ZOOM_DEFAULT);

        updatePcb(pcb);

        _pcbPosition.x = x;
        _pcbPosition.y = y;
        _renderer = new PcbRenderer(myr, sprites, pcb);

        matchWorldPosition();
        revalidate();
        moveCursor();
    };

    /**
     * Get the pcb editor width
     * @returns {Number} The width of the editor in pixels.
     */
    this.getWidth = () => width;

    /**
     * Get the PCB position.
     * @returns {Myr.Vector} The PCB position.
     */
    this.getPCBPosition = () => _pcbPosition;

    /**
     * Press the mouse.
     */
    this.onMousePress = () => {
        if (!mouseDown()) {
            _pressLocation = view.getMouse().copy();
            view.onMousePress();
        }
    };

    /**
     * Release the mouse.
     */
    this.onMouseRelease = () => {
        if (_pressLocation && _pressLocation.equals(view.getMouse()))
            _editor.reset();
        else
            mouseUp();

        _pressLocation = null;

        view.onMouseRelease();
    };

    /**
     * Move the mouse.
     * @param {Number} x The mouse x position in pixels.
     * @param {Number} y The mouse y position in pixels.
     */
    this.onMouseMove = (x, y) => {
        view.onMouseMove(x, y);

        if (view.isDragging())
            matchWorldPosition();

        if (updateCursor())
            moveCursor();
    };

    /**
     * The mouse enters.
     */
    this.onMouseEnter = () => {

    };

    /**
     * The mouse leaves.
     */
    this.onMouseLeave = () => {
        if (!_editor)
            return;

        _editor.cancelAction();
        view.onMouseRelease();
    };

    /**
     * Zoom in.
     */
    this.zoomIn = () => {
        if (_editor.zoomIn())
            return;

        view.zoomIn();

        matchWorldPosition();
    };

    /**
     * Zoom out.
     */
    this.zoomOut = () => {
        if (_editor.zoomOut())
            return;

        view.zoomOut();

        matchWorldPosition();
    };

    /**
     * A key is pressed.
     * @param {String} key A key.
     * @param {Boolean} control Indicates whether the control button is pressed.
     */
    this.onKeyDown = (key, control) => {
        switch(key) {
            case KEY_UNDO:
                if (control)
                    undoPop();
                break;
            case KEY_REDO:
                if (control)
                    redoPop();
                break;
            default:
                _editor.onKeyDown(key, control);
        }
    };

    /**
     * Free all resources occupied by this editor.
     */
    this.free = () => {
        if (_renderer)
            _renderer.free();
    };
}

PcbEditor.EDIT_MODE_SELECT = 0;
PcbEditor.EDIT_MODE_RESHAPE = 1;
PcbEditor.EDIT_MODE_ETCH = 2;