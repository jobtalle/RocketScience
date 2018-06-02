import {Pcb} from "../pcb/pcb";
import {PcbRenderer} from "../pcb/pcbRenderer";

/**
 * The interactive Pcb editor which takes care of sizing & modifying a Pcb.
 * @param {Object} myr An instance of the Myriad engine.
 * @param {Object} sprites All sprites.
 * @param {Number} width The editor width.
 * @param {Number} height The editor height.
 * @constructor
 */
export function PcbEditor(myr, sprites, width, height) {
    const Cell = function(x, y) {
        this.x = x;
        this.y = y;
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
    const SPRITE_HOVER_POINT = sprites.getSprite("pcbSelect");
    const SPRITE_HOVER_EXTEND = sprites.getSprite("pcbExtend");
    const SPRITE_HOVER_DELETE = sprites.getSprite("pcbDelete");
    const UNDO_COUNT = 64;
    const SCALE = 4;

    const _undoStack = [];
    const _redoStack = [];
    const _surface = new myr.Surface(
        Math.ceil(width / SCALE),
        Math.ceil(height / SCALE));

    let _pcb = null;
    let _renderer = null;
    let _editMode = EDIT_MODE_SELECT;
    let _drawX;
    let _drawY;
    let _cursorX = -1;
    let _cursorY = -1;
    let _mouseX = -1;
    let _mouseY = -1;
    let _cursorPoint = null;
    let _cursorExtendable = false;
    let _cursorDragMode = DRAG_MODE_NONE;
    let _cursorDragCells = [];
    let _cursorDragX;
    let _cursorDragY;

    const revalidate = () => {
        if(_renderer)
            _renderer.revalidate();
        
        _drawX = Math.floor((_surface.getWidth() - _pcb.getWidth() * Pcb.PIXELS_PER_POINT) * 0.5);
        _drawY = Math.floor((_surface.getHeight() - _pcb.getHeight() * Pcb.PIXELS_PER_POINT) * 0.5);
    };

    const undoPush = () => {
        _undoStack.push(_pcb.copy());

        if (_undoStack > UNDO_COUNT)
            _undoStack.splice(0, 1);

        _redoStack.length = 0;
    };

    const undoPop = () => {
        const newPcb = _undoStack.pop();

        if (newPcb) {
            _redoStack.push(_pcb.copy());

            this.edit(newPcb);
        }
    };

    const redoPop = () => {
        const newPcb = _redoStack.pop();

        if (newPcb) {
            _undoStack.push(_pcb.copy());

            this.edit(newPcb);
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
        const oldX = _cursorX;
        const oldY = _cursorY;

        _cursorX = Math.floor((_mouseX / SCALE - _drawX) / Pcb.PIXELS_PER_POINT);
        _cursorY = Math.floor((_mouseY / SCALE - _drawY) / Pcb.PIXELS_PER_POINT);

        return _cursorX !== oldX || _cursorY !== oldY;
    };

    const moveCursor = () => {
        if(_cursorX >= 0 && _cursorY >= 0) {
            _cursorPoint = _pcb.getPoint(_cursorX, _cursorY);

            if(!_cursorPoint)
                _cursorExtendable =
                    _pcb.getPoint(_cursorX + 1, _cursorY) ||
                    _pcb.getPoint(_cursorX, _cursorY + 1) ||
                    (_cursorX > 0 && _pcb.getPoint(_cursorX - 1, _cursorY)) ||
                    (_cursorY > 0 && _pcb.getPoint(_cursorX, _cursorY - 1));
        } else {
            _cursorPoint = null;
            _cursorExtendable =
                (_cursorX === -1 && _cursorY >= 0 && _pcb.getPoint(0, _cursorY)) ||
                (_cursorY === -1 && _cursorX >= 0 && _pcb.getPoint(_cursorX, 0));
        }

        switch(_cursorDragMode) {
            case DRAG_MODE_AREA:
                const left = Math.min(_cursorX, _cursorDragX);
                const right = Math.max(_cursorX, _cursorDragX);
                const top = Math.min(_cursorY, _cursorDragY);
                const bottom = Math.max(_cursorY, _cursorDragY);

                _cursorDragCells.splice(0, _cursorDragCells.length);

                for (let y = top; y <= bottom; ++y)
                    for (let x = left; x <= right; ++x)
                        if(dragCellAcceptable(x, y))
                            _cursorDragCells.push(new Cell(x, y));

                if (_editMode === EDIT_MODE_DELETE)
                    dragPreventSplit(left, top, right, bottom);

                break;
        }
    };

    const dragPreventSplit = (left, top, right, bottom) => {
        const groups = [];

        for (let y = 0; y < _pcb.getHeight(); ++y) for (let x = 0; x < _pcb.getWidth(); ++x) {
            if (x >= left && x <= right && y >= top && y <= bottom)
                continue;

            if (!_pcb.getPoint(x, y))
                continue;

            const cell = new Cell(x, y);
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
                    _cursorDragX = _cursorX;
                    _cursorDragY = _cursorY;

                    moveCursor();
                }
                break;
            case EDIT_MODE_DELETE:
                if(_cursorPoint) {
                    _cursorDragMode = DRAG_MODE_AREA;
                    _cursorDragX = _cursorX;
                    _cursorDragY = _cursorY;

                    moveCursor();
                }
                break;
        }
    };

    const dragCellsExtend = () => {
        undoPush();

        let xMin = 0;
        let yMin = 0;
        const negatives = [];

        for(const cell of _cursorDragCells) {
            if(cell.x < 0 || cell.y < 0) {
                if(cell.x < xMin)
                    xMin = cell.x;

                if(cell.y < yMin)
                    yMin = cell.y;

                negatives.push(cell);
            }
            else
                _pcb.extend(cell.x, cell.y);
        }

        _pcb.shift(-xMin, -yMin);

        for(const cell of negatives)
            _pcb.extend(cell.x - xMin, cell.y - yMin);

        revalidate();
        updateCursor();
        moveCursor();
    };

    const dragCellsErase = () => {
        undoPush();

        for(const cell of _cursorDragCells)
            _pcb.erase(cell.x, cell.y);

        _pcb.pack();

        revalidate();
        updateCursor();
        moveCursor();
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
                    SPRITE_HOVER_POINT.draw(_cursorX * Pcb.PIXELS_PER_POINT, _cursorY * Pcb.PIXELS_PER_POINT);
                else if (_cursorExtendable)
                    SPRITE_HOVER_EXTEND.draw(_cursorX * Pcb.PIXELS_PER_POINT, _cursorY * Pcb.PIXELS_PER_POINT);
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
                    SPRITE_HOVER_DELETE.draw(_cursorX * Pcb.PIXELS_PER_POINT, _cursorY * Pcb.PIXELS_PER_POINT);
                break;
            case DRAG_MODE_AREA:
                for (const cell of _cursorDragCells)
                    SPRITE_HOVER_DELETE.draw(cell.x * Pcb.PIXELS_PER_POINT, cell.y * Pcb.PIXELS_PER_POINT);
                break;
        }
    };

    /**
     * Update the state of the pcb editor.
     * @param timeStep The number of seconds passed after the previous update.
     */
    this.update = timeStep => {
        _surface.bind();
        _surface.clear();

        myr.push();
        myr.translate(_drawX, _drawY);

        _renderer.draw(0, 0);

        switch(_editMode) {
            case EDIT_MODE_SELECT:
                drawSelect();
                break;
            case EDIT_MODE_DELETE:
                drawDelete();
                break;
        }

        myr.pop();
    };

    /**
     * Draw the pcb editor.
     */
    this.draw = x => {
        _surface.drawScaled(x, 0, SCALE, SCALE);
    };

    /**
     * Start editing a pcb.
     * @param {Object} pcb A pcb instance to edit.
     */
    this.edit = pcb => {
        _pcb = pcb;
        _renderer = new PcbRenderer(myr, sprites, pcb);

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
        startDrag();
    };

    /**
     * Release the mouse.
     */
    this.onMouseRelease = () => {
        stopDrag();
    };

    /**
     * Move the mouse.
     * @param {Number} x The mouse x position in pixels.
     * @param {Number} y The mouse y position in pixels.
     */
    this.onMouseMove = (x, y) => {
        _mouseX = x;
        _mouseY = y;

        if (updateCursor())
            moveCursor();
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
}