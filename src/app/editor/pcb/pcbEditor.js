import {Terrain} from "../../world/terrain/terrain";
import {World} from "../../world/world";
import {Pcb} from "../../pcb/pcb";
import {PcbRenderer} from "../../pcb/pcbRenderer";
import {View} from "../../view/view";
import {ZoomProfile} from "../../view/zoomProfile";
import Myr from "../../../lib/myr.js"
import {ShiftProfile} from "../../view/shiftProfile";
import {PcbEditorExtend} from "./PcbEditorExtend";
import {PcbEditorPlace} from "./PcbEditorPlace";

/**
 * The interactive Pcb editor which takes care of sizing & modifying a Pcb.
 * @param {Myr} myr An instance of the Myriad engine.
 * @param {Sprites} sprites All sprites.
 * @param {World} world A world instance to interact with.
 * @param {Number} width The editor width.
 * @param {Number} height The editor height.
 * @param {Number} x The X position of the editor view in pixels.
 * @constructor
 */
export function PcbEditor(myr, sprites, world, width, height, x) {
    const State = function(pcb, position) {
        this.getPcb = () => pcb;
        this.getPosition = () => position;
    };

    const KEY_UNDO = "z";
    const KEY_REDO = "y";
    const UNDO_COUNT = 64;
    const ZOOM_DEFAULT = 4;
    const ZOOM_FACTOR = 0.15;
    const ZOOM_MIN = 1;
    const ZOOM_MAX = 8;

    const _undoStack = [];
    const _redoStack = [];
    const _cursor = new Myr.Vector(-1, -1);
    const _pcbPosition = new Myr.Vector(0, 0);
    const _view = new View(
        width,
        height,
        new ZoomProfile(
            ZoomProfile.TYPE_ROUND,
            ZOOM_FACTOR,
            ZOOM_DEFAULT,
            ZOOM_MIN,
            ZOOM_MAX),
        new ShiftProfile(
            1));

    let _pcb = null;
    let _renderer = null;
    let _editor = null;

    const makeInterface = () => {
        return {
            revalidate: revalidate,
            undoPush: undoPush,
            replace: setEditor,
            shift: shift
        };
    };

    const shift = (dx, dy) => {
        _pcbPosition.x += dx * Terrain.METERS_PER_PIXEL;
        _pcbPosition.y += dy * Terrain.METERS_PER_PIXEL;

        _view.focus(_view.getFocusX() - dx, _view.getFocusY() - dy, _view.getZoom());

        matchWorldPosition();
    };

    const setEditor = editor => {
        _editor = editor;

        moveCursor();
    };

    const matchWorldPosition = () => {
        world.getView().focus(
            _view.getFocusX() + _pcbPosition.x * Terrain.PIXELS_PER_METER - x * 0.5 / _view.getZoom(),
            _view.getFocusY() + _pcbPosition.y * Terrain.PIXELS_PER_METER,
            _view.getZoom());
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

        _cursor.x = _view.getMouse().x;
        _cursor.y = _view.getMouse().y;

        _view.getInverse().apply(_cursor);

        _cursor.x = Math.floor(_cursor.x / Pcb.PIXELS_PER_POINT);
        _cursor.y = Math.floor(_cursor.y / Pcb.PIXELS_PER_POINT);

        return _cursor.x !== oldX || _cursor.y !== oldY;
    };

    const moveCursor = () => {
        _editor.moveCursor();
    };

    const mouseDown = () => {
        return _editor.mouseDown();
    };

    const mouseUp = () => {
        _editor.mouseUp();
    };

    /**
     * Update the state of the pcb editor.
     * @param timeStep The number of seconds passed after the previous update.
     */
    this.update = timeStep => {
        _editor.update(timeStep);
    };

    /**
     * Draw the pcb editor.
     */
    this.draw = x => {
        myr.push();
        myr.translate(x, 0);
        myr.transform(_view.getTransform());

        _renderer.draw(0, 0);
        _editor.draw(myr);

        myr.pop();
    };

    /**
     * Show the pcb editor.
     */
    this.show = () => {
        matchWorldPosition();

        _cursor.x = _cursor.y = -1;

        setEditor(new PcbEditorExtend(sprites, _pcb, _cursor, makeInterface()));
        moveCursor();
    };

    /**
     * Hide the pcb editor.
     */
    this.hide = () => {
        _view.onMouseRelease();

        world.addPcb(_pcb, _pcbPosition.x, _pcbPosition.y);
    };

    /**
     * Start placing a part.
     * @param {Object} part The part's constructor.
     */
    this.place = part => {
        setEditor(new PcbEditorPlace(sprites, _pcb, _cursor, makeInterface(), part));
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

            _view.focus(
                _view.getFocusX() - dx,
                _view.getFocusY() - dy,
                _view.getZoom());
        }
        else
            _view.focus(
                pcb.getWidth() * 0.5 * Pcb.PIXELS_PER_POINT,
                pcb.getHeight() * 0.5 * Pcb.PIXELS_PER_POINT,
                ZOOM_DEFAULT);

        _pcb = pcb;
        _pcbPosition.x = x;
        _pcbPosition.y = y;
        _renderer = new PcbRenderer(myr, sprites, pcb);

        setEditor(new PcbEditorExtend(sprites, _pcb, _cursor, makeInterface()));

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
     * Press the mouse.
     */
    this.onMousePress = () => {
        if (!mouseDown())
            _view.onMousePress();
    };

    /**
     * Release the mouse.
     */
    this.onMouseRelease = () => {
        mouseUp();

        _view.onMouseRelease();
    };

    /**
     * Move the mouse.
     * @param {Number} x The mouse x position in pixels.
     * @param {Number} y The mouse y position in pixels.
     */
    this.onMouseMove = (x, y) => {
        _view.onMouseMove(x, y);

        if (_view.isDragging())
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
        _editor.cancelAction();
        _view.onMouseRelease();
    };

    /**
     * Zoom in.
     */
    this.zoomIn = () => {
        _view.zoomIn();

        matchWorldPosition();
    };

    /**
     * Zoom out.
     */
    this.zoomOut = () => {
        _view.zoomOut();

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