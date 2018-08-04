import {Terrain} from "../world/terrain/terrain";
import {World} from "./../world/world";
import {Pcb} from "../pcb/pcb";
import {PcbRenderer} from "../pcb/pcbRenderer";
import {View} from "../view/view";
import {ZoomProfile} from "../view/zoomProfile";
import Myr from "../../lib/myr.js"
import {ShiftProfile} from "../view/shiftProfile";
import {PcbShape} from "../pcb/pcbShape";
import {PartRenderer} from "../parts/renderer/partRenderer";

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

    const CellGroup = function(first) {
        this.cells = [first];
        this.left = first.x - 1;
        this.top = first.y - 1;
        this.right = first.x + 1;
        this.bottom = first.y + 1;

        this.contains = cell => {
            if (cell.x < this.left || cell.y < this.top || cell.x > this.right || cell.y > this.bottom)
                return false;

            for (let i = this.cells.length; i-- > 0;) {
                const compareCell = this.cells[i];

                if (
                    (compareCell.x === cell.x && compareCell.y === cell.y - 1) ||
                    (compareCell.y === cell.y && compareCell.x === cell.x - 1))
                    return true;
            }

            return false;
        };

        this.push = cell => {
            if (cell.x === this.left)
                this.left = cell.x - 1;
            else if (cell.x === this.right)
                this.right = cell.x + 1;

            if (cell.y === this.top)
                this.top = cell.y - 1;
            else if (cell.y === this.bottom)
                this.bottom = cell.y + 1;

            this.cells.push(cell);
        };

        this.concat = group => {
            this.left = Math.min(this.left, group.left);
            this.top = Math.min(this.top, group.top);
            this.right = Math.max(this.right, group.right);
            this.bottom = Math.max(this.bottom, group.bottom);

            this.cells = this.cells.concat(group.cells);
        };
    };

    const KEY_TOGGLE_DELETE = "Delete";
    const KEY_UNDO = "z";
    const KEY_REDO = "y";
    const DRAG_MODE_NONE = 0;
    const DRAG_MODE_AREA = 1;
    const EDIT_MODE_SELECT = 0;
    const EDIT_MODE_DELETE = 1;
    const EDIT_MODE_PLACE = 2;
    const SPRITE_HOVER_POINT = sprites.getSprite("pcbSelect");
    const SPRITE_HOVER_EXTEND = sprites.getSprite("pcbExtend");
    const SPRITE_HOVER_DELETE = sprites.getSprite("pcbDelete");
    const UNDO_COUNT = 64;
    const ZOOM_DEFAULT = 4;
    const ZOOM_FACTOR = 0.15;
    const ZOOM_MIN = 1;
    const ZOOM_MAX = 8;

    const _undoStack = [];
    const _redoStack = [];
    const _cursor = new Myr.Vector(-1, -1);
    const _cursorDrag = new Myr.Vector(0, 0);
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
    let _editMode = EDIT_MODE_SELECT;
    let _cursorPoint = null;
    let _cursorExtendable = false;
    let _cursorDragMode = DRAG_MODE_NONE;
    let _cursorDragCells = [];
    let _placing = null;
    let _placingRenderer = null;

    const matchWorldPosition = () => {
        world.getView().focus(
            _view.getFocusX() + _pcbPosition.x * Terrain.PIXELS_PER_METER - x * 0.5 / _view.getZoom(),
            _view.getFocusY() + _pcbPosition.y * Terrain.PIXELS_PER_METER,
            _view.getZoom());
    };

    const revalidate = () => {
        if(_renderer)
            _renderer.revalidate();
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

    const dragCellAcceptable = (x, y) => {
        switch(_editMode) {
            case EDIT_MODE_SELECT:
                return !(x >= 0 && y>= 0 && _pcb.getPoint(x, y));
            case EDIT_MODE_DELETE:
                return x >= 0 && y >= 0 && _pcb.getPoint(x, y);
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
        if(_cursor.x >= 0 && _cursor.y >= 0) {
            _cursorPoint = _pcb.getPoint(_cursor.x, _cursor.y);

            if(!_cursorPoint)
                _cursorExtendable =
                    _pcb.getPoint(_cursor.x + 1, _cursor.y) ||
                    _pcb.getPoint(_cursor.x, _cursor.y + 1) ||
                    (_cursor.x > 0 && _pcb.getPoint(_cursor.x - 1, _cursor.y)) ||
                    (_cursor.y > 0 && _pcb.getPoint(_cursor.x, _cursor.y - 1));
        } else {
            _cursorPoint = null;
            _cursorExtendable =
                (_cursor.x === -1 && _cursor.y >= 0 && _pcb.getPoint(0, _cursor.y)) ||
                (_cursor.y === -1 && _cursor.x >= 0 && _pcb.getPoint(_cursor.x, 0));
        }

        switch(_cursorDragMode) {
            case DRAG_MODE_AREA:
                const left = Math.min(_cursor.x, _cursorDrag.x);
                const right = Math.max(_cursor.x, _cursorDrag.x);
                const top = Math.min(_cursor.y, _cursorDrag.y);
                const bottom = Math.max(_cursor.y, _cursorDrag.y);

                _cursorDragCells.splice(0, _cursorDragCells.length);

                for (let y = top; y <= bottom; ++y)
                    for (let x = left; x <= right; ++x)
                        if(dragCellAcceptable(x, y))
                            _cursorDragCells.push(new Myr.Vector(x, y));

                if (_editMode === EDIT_MODE_DELETE)
                    dragPreventSplit(left, top, right, bottom);

                break;
        }
    };

    const dragPreventSplit = (left, top, right, bottom) => {
        if (_cursorDragCells.length === _pcb.getPointCount()) {
            _cursorDragCells.splice(0, _cursorDragCells.length);

            return;
        }

        const groups = [];

        for (let y = 0; y < _pcb.getHeight(); ++y) for (let x = 0; x < _pcb.getWidth(); ++x) {
            if (x >= left && x <= right && y >= top && y <= bottom)
                continue;

            if (!_pcb.getPoint(x, y))
                continue;

            const cell = new Myr.Vector(x, y);
            const matches = [];

            for (let group = 0; group < groups.length; ++group) {
                if (groups[group].contains(cell))
                    matches.push(group);
            }

            switch (matches.length) {
                case 0:
                    groups.push(new CellGroup(cell));
                    break;
                default:
                    matches.sort();

                    for (let i = matches.length; i-- > 1;) {
                        groups[matches[0]].concat(groups[matches[i]]);
                        groups.splice(matches[i], 1);
                    }
                case 1:
                    groups[matches[0]].push(cell);
                    break;
            }
        }

        if (groups.length > 1) {
            let largestGroupSize = 0;
            let largestGroup;

            for (let group = 0; group < groups.length; ++group) {
                if (groups[group].cells.length > largestGroupSize) {
                    largestGroupSize = groups[group].cells.length;
                    largestGroup = group;
                }
            }

            for (let group = 0; group < groups.length; ++group) {
                if (group === largestGroup)
                    continue;

                for (let i = 0; i < groups[group].cells.length; ++i)
                    _cursorDragCells.push(groups[group].cells[i]);
            }
        }
    };

    const startDrag = () => {
        switch(_editMode) {
            case EDIT_MODE_SELECT:
                if(!_cursorPoint && _cursorExtendable) {
                    _cursorDragMode = DRAG_MODE_AREA;
                    _cursorDrag.x = _cursor.x;
                    _cursorDrag.y = _cursor.y;

                    moveCursor();

                    return true;
                }
                break;
            case EDIT_MODE_DELETE:
                if(_cursorPoint) {
                    _cursorDragMode = DRAG_MODE_AREA;
                    _cursorDrag.x = _cursor.x;
                    _cursorDrag.y = _cursor.y;

                    moveCursor();

                    return true;
                }
                break;
        }

        return false;
    };

    const dragCellsExtend = () => {
        undoPush();

        const negatives = [];

        let xMin = 0;
        let yMin = 0;
        let yMax = _pcb.getHeight() - 1;

        for (const cell of _cursorDragCells) {
            if (cell.x < 0 || cell.y < 0) {
                if (cell.x < xMin)
                    xMin = cell.x;

                if (cell.y < yMin)
                    yMin = cell.y;

                negatives.push(cell);
            }
            else {
                if (cell.y > yMax)
                    yMax = cell.y;

                _pcb.extend(cell.x, cell.y);
            }
        }

        const dx = xMin * Pcb.PIXELS_PER_POINT;
        const dy = yMin * Pcb.PIXELS_PER_POINT;

        _pcbPosition.x += dx * Terrain.METERS_PER_PIXEL;
        _pcbPosition.y += dy * Terrain.METERS_PER_PIXEL;

        _view.focus(
            _view.getFocusX() - dx,
            _view.getFocusY() - dy,
            _view.getZoom());
        _pcb.shift(-xMin, -yMin);

        for (const cell of negatives)
            _pcb.extend(cell.x - xMin, cell.y - yMin);

        revalidate();
        matchWorldPosition();
        moveCursor();
        updateCursor();
    };

    const dragCellsErase = () => {
        if (_cursorDragCells.length === _pcb.getPointCount())
            return;

        undoPush();

        for (const cell of _cursorDragCells)
            _pcb.erase(cell.x, cell.y);

        const packReport = _pcb.pack();

        const dx = -packReport.left * Pcb.PIXELS_PER_POINT;
        const dy = -packReport.top * Pcb.PIXELS_PER_POINT;

        _pcbPosition.x -= dx * Terrain.METERS_PER_PIXEL;
        _pcbPosition.y -= dy * Terrain.METERS_PER_PIXEL;

        _view.focus(
            _view.getFocusX() + dx,
            _view.getFocusY() + dy,
            _view.getZoom());

        revalidate();
        matchWorldPosition();
        moveCursor();
        updateCursor();
    };

    const stopDrag = () => {
        switch(_editMode) {
            case EDIT_MODE_SELECT:
                switch(_cursorDragMode) {
                    case DRAG_MODE_AREA:
                        dragCellsExtend();
                        break;
                }
                break;
            case EDIT_MODE_DELETE:
                switch(_cursorDragMode) {
                    case DRAG_MODE_AREA:
                        dragCellsErase();
                        break;
                }
                break;
        }

        _cursorDragMode = DRAG_MODE_NONE;
    };

    const drawSelect = () => {
        switch(_cursorDragMode) {
            case DRAG_MODE_NONE:
                if (_cursorPoint)
                    SPRITE_HOVER_POINT.draw(_cursor.x * Pcb.PIXELS_PER_POINT, _cursor.y * Pcb.PIXELS_PER_POINT);
                else if (_cursorExtendable)
                    SPRITE_HOVER_EXTEND.draw(_cursor.x * Pcb.PIXELS_PER_POINT, _cursor.y * Pcb.PIXELS_PER_POINT);
                break;
            case DRAG_MODE_AREA:
                for(const cell of _cursorDragCells)
                    SPRITE_HOVER_EXTEND.draw(cell.x * Pcb.PIXELS_PER_POINT, cell.y * Pcb.PIXELS_PER_POINT);
                break;
        }
    };

    const drawDelete = () => {
        switch(_cursorDragMode) {
            case DRAG_MODE_NONE:
                if (_cursorPoint)
                    SPRITE_HOVER_DELETE.draw(_cursor.x * Pcb.PIXELS_PER_POINT, _cursor.y * Pcb.PIXELS_PER_POINT);
                break;
            case DRAG_MODE_AREA:
                for (const cell of _cursorDragCells)
                    SPRITE_HOVER_DELETE.draw(cell.x * Pcb.PIXELS_PER_POINT, cell.y * Pcb.PIXELS_PER_POINT);
                break;
        }
    };

    const drawPlace = () => {
        _placingRenderer.draw(_cursor.x * Pcb.PIXELS_PER_POINT, _cursor.y * Pcb.PIXELS_PER_POINT);
    };

    const cancelAction = () => {
        _editMode = EDIT_MODE_SELECT;
        _cursorDragMode = DRAG_MODE_NONE;
        _cursor.x = _cursor.y = -1;
    };

    /**
     * Update the state of the pcb editor.
     * @param timeStep The number of seconds passed after the previous update.
     */
    this.update = timeStep => {

    };

    /**
     * Draw the pcb editor.
     */
    this.draw = x => {
        myr.push();
        myr.translate(x, 0);
        myr.transform(_view.getTransform());

        _renderer.draw(0, 0);

        switch(_editMode) {
            case EDIT_MODE_SELECT:
                drawSelect();
                break;
            case EDIT_MODE_DELETE:
                drawDelete();
                break;
            case EDIT_MODE_PLACE:
                drawPlace();
                break;
        }

        myr.pop();
    };

    /**
     * Show the pcb editor.
     */
    this.show = () => {
        matchWorldPosition();
    };

    /**
     * Hide the pcb editor.
     */
    this.hide = () => {
        _view.onMouseRelease();

        cancelAction();

        world.addPcb(_pcb, _pcbPosition.x, _pcbPosition.y);
    };

    /**
     * Start placing a part.
     * @param {Object} part The part's constructor.
     */
    this.place = part => {
        _placing = part;
        _placingRenderer = new PartRenderer(sprites, part.CONFIGURATIONS[0]);
        _editMode = EDIT_MODE_PLACE;
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
        if (!startDrag())
            _view.onMousePress();
    };

    /**
     * Release the mouse.
     */
    this.onMouseRelease = () => {
        stopDrag();

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
            case KEY_TOGGLE_DELETE:
                switch(_editMode) {
                    case EDIT_MODE_SELECT:
                        _editMode = EDIT_MODE_DELETE;
                        break;
                    case EDIT_MODE_DELETE:
                        _editMode = EDIT_MODE_SELECT;
                        break;
                }
                break;
            case KEY_UNDO:
                if (control)
                    undoPop();
                break;
            case KEY_REDO:
                if (control)
                    redoPop();
                break;
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