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

    const KEY_TOGGLE_DELETE = "Delete";
    const DRAG_MODE_NONE = 0;
    const DRAG_MODE_AREA = 1;
    const EDIT_MODE_SELECT = 0;
    const EDIT_MODE_DELETE = 1;
    const SPRITE_HOVER_POINT = sprites.getSprite("pcbSelect");
    const SPRITE_HOVER_EXTEND = sprites.getSprite("pcbExtend");
    const SPRITE_HOVER_DELETE = sprites.getSprite("pcbDelete");
    const SCALE = 4;

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
    let _cursorPoint = null;
    let _cursorExtendable = false;
    let _cursorDragMode = DRAG_MODE_NONE;
    let _cursorDragCells = [];
    let _cursorDragX;
    let _cursorDragY;

    const revalidate = () => {
        if(_renderer)
            _renderer.revalidate();
        
        _drawX = Math.floor((_surface.getWidth() - _pcb.getWidth() * Pcb.POINT_SIZE) * 0.5);
        _drawY = Math.floor((_surface.getHeight() - _pcb.getHeight() * Pcb.POINT_SIZE) * 0.5);
    };

    const dragCellAcceptable = (x, y) => {
        switch(_editMode) {
            case EDIT_MODE_SELECT:
                return !(x >= 0 && y>= 0 && _pcb.getPoint(x, y));
            case EDIT_MODE_DELETE:
                return x >= 0 && y >= 0 && _pcb.getPoint(x, y);
        }
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
                const xFrom = Math.min(_cursorX, _cursorDragX);
                const xTo = Math.max(_cursorX, _cursorDragX);
                const yFrom = Math.min(_cursorY, _cursorDragY);
                const yTo = Math.max(_cursorY, _cursorDragY);

                _cursorDragCells.splice(0, _cursorDragCells.length);

                for(let y = yFrom; y <= yTo; ++y)
                    for(let x = xFrom; x <= xTo; ++x)
                        if(dragCellAcceptable(x, y))
                            _cursorDragCells.push(new Cell(x, y));
                break;
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
        moveCursor();
    };

    const dragCellsErase = () => {
        for(const cell of _cursorDragCells)
            _pcb.erase(cell.x, cell.y);

        _pcb.pack();

        revalidate();
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
                    SPRITE_HOVER_POINT.draw(_cursorX * Pcb.POINT_SIZE, _cursorY * Pcb.POINT_SIZE);
                else if (_cursorExtendable)
                    SPRITE_HOVER_EXTEND.draw(_cursorX * Pcb.POINT_SIZE, _cursorY * Pcb.POINT_SIZE);
                break;
            case DRAG_MODE_AREA:
                for(const cell of _cursorDragCells)
                    SPRITE_HOVER_EXTEND.draw(cell.x * Pcb.POINT_SIZE, cell.y * Pcb.POINT_SIZE);
                break;
        }
    };

    const drawDelete = () => {
        switch(_cursorDragMode) {
            case DRAG_MODE_NONE:
                if (_cursorPoint)
                    SPRITE_HOVER_DELETE.draw(_cursorX * Pcb.POINT_SIZE, _cursorY * Pcb.POINT_SIZE);
                break;
            case DRAG_MODE_AREA:
                for (const cell of _cursorDragCells)
                    SPRITE_HOVER_DELETE.draw(cell.x * Pcb.POINT_SIZE, cell.y * Pcb.POINT_SIZE);
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
    };

    /**
     * Get the pcb editor width
     * @returns {Number} The width of the editor in pixels.
     */
    this.getWidth = () => width;

    /**
     * Press the mouse.
     * @param {Number} x The mouse x position in pixels.
     * @param {Number} y The mouse y position in pixels.
     */
    this.onMousePress = (x, y) => {
        startDrag();
    };

    /**
     * Release the mouse.
     * @param {Number} x The mouse x position in pixels.
     * @param {Number} y The mouse y position in pixels.
     */
    this.onMouseRelease = (x, y) => {
        stopDrag();
    };

    /**
     * Move the mouse.
     * @param {Number} x The mouse x position in pixels.
     * @param {Number} y The mouse y position in pixels.
     */
    this.onMouseMove = (x, y) => {
        const oldX = _cursorX;
        const oldY = _cursorY;

        _cursorX = Math.floor((x / SCALE - _drawX) / Pcb.POINT_SIZE);
        _cursorY = Math.floor((y / SCALE - _drawY) / Pcb.POINT_SIZE);

        if(_cursorX !== oldX || _cursorY !== oldY)
            moveCursor();
    };

    /**
     * A key is pressed.
     * @param {String} key A key.
     */
    this.onKeyDown = key => {
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
        }
    };
}