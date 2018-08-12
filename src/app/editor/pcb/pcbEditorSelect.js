import {Pcb} from "../../pcb/pcb";
import * as Myr from "../../../lib/myr";

/**
 * An extend editor, able to extend the current PCB.
 * @param {Sprites} sprites A sprites instance.
 * @param {Pcb} pcb The PCB currently being edited.
 * @param {Myr.Vector} cursor The cursor position in cells.
 * @param {Object} editor An interface provided by the Editor to influence the editor.
 * @constructor
 */
export function PcbEditorSelect(sprites, pcb, cursor, editor) {
    const SPRITE_SELECT = sprites.getSprite("pcbSelect");
    const SPRITE_SELECT_LT = sprites.getSprite("pcbSelectLT");
    const SPRITE_SELECT_RT = sprites.getSprite("pcbSelectRT");
    const SPRITE_SELECT_LB = sprites.getSprite("pcbSelectLB");
    const SPRITE_SELECT_RB = sprites.getSprite("pcbSelectRB");
    const SPRITE_SELECT_T = sprites.getSprite("pcbSelectT");
    const SPRITE_SELECT_B = sprites.getSprite("pcbSelectB");
    const SPRITE_SELECT_L = sprites.getSprite("pcbSelectL");
    const SPRITE_SELECT_R = sprites.getSprite("pcbSelectR");
    const SPRITE_SELECT_LRT = sprites.getSprite("pcbSelectLRT");
    const SPRITE_SELECT_LR = sprites.getSprite("pcbSelectLR");
    const SPRITE_SELECT_LRB = sprites.getSprite("pcbSelectLRB");
    const SPRITE_SELECT_LTB = sprites.getSprite("pcbSelectLTB");
    const SPRITE_SELECT_TB = sprites.getSprite("pcbSelectTB");
    const SPRITE_SELECT_RTB = sprites.getSprite("pcbSelectRTB");

    const _cursorDragPoints = [];
    const _cursorDrag = new Myr.Vector(0, 0);
    let _selectable = false;
    let _dragging = false;
    let _left = 0;
    let _right = 0;
    let _top = 0;
    let _bottom = 0;

    /**
     * A key is pressed.
     * @param {String} key A key.
     * @param {Boolean} control Indicates whether the control button is pressed.
     */
    this.onKeyDown = (key, control) => {

    };

    /**
     * Tell the editor the cursor has moved.
     */
    this.moveCursor = () => {
        if (_dragging) {
            _left = Math.min(cursor.x, _cursorDrag.x);
            _right = Math.max(cursor.x, _cursorDrag.x);
            _top = Math.min(cursor.y, _cursorDrag.y);
            _bottom = Math.max(cursor.y, _cursorDrag.y);

            _cursorDragPoints.splice(0, _cursorDragPoints.length);

            for (let y = _top; y <= _bottom; ++y) for (let x = _left; x <= _right; ++x)
                _cursorDragPoints.push(new Myr.Vector(x, y));
        }
        else
            _selectable = pcb.getPoint(cursor.x, cursor.y) !== null;
    };

    /**
     * Start dragging action.
     * @returns {Boolean} A boolean indicating whether a drag event has started.
     */
    this.mouseDown = () => {
        if (_selectable) {
            _cursorDrag.x = cursor.x;
            _cursorDrag.y = cursor.y;
            _dragging = true;

            this.moveCursor();

            return true;
        }

        return false;
    };


    /**
     * Finish the current dragging action.
     */
    this.mouseUp = () => {
        if (_dragging) {
            _cursorDragPoints.splice(0, _cursorDragPoints.length);

            _selectable = false;
            _dragging = false;
        }
    };

    /**
     * Cancel any actions deviating from this editors base state.
     */
    this.cancelAction = () => {
        _dragging = false;

        this.moveCursor();
    };

    /**
     * Update this editor.
     * @param {Number} timeStep The time passed since the last update in seconds.
     */
    this.update = timeStep => {

    };

    /**
     * Draw this editor.
     * @param {Myr} myr A myriad instance.
     */
    this.draw = myr => {
        if (_dragging) {
            if (_left === _right) {
                if (_top === _bottom)
                    SPRITE_SELECT.draw(_left * Pcb.PIXELS_PER_POINT, _top * Pcb.PIXELS_PER_POINT);
                else {
                    SPRITE_SELECT_LRT.draw(_left * Pcb.PIXELS_PER_POINT, _top * Pcb.PIXELS_PER_POINT);
                    SPRITE_SELECT_LRB.draw(_left * Pcb.PIXELS_PER_POINT, _bottom * Pcb.PIXELS_PER_POINT);

                    for (let y = _top + 1; y < _bottom; ++y)
                        SPRITE_SELECT_LR.draw(_left * Pcb.PIXELS_PER_POINT, y * Pcb.PIXELS_PER_POINT);
                }
            }
            else if (_top === _bottom) {
                SPRITE_SELECT_LTB.draw(_left * Pcb.PIXELS_PER_POINT, _top * Pcb.PIXELS_PER_POINT);
                SPRITE_SELECT_RTB.draw(_right * Pcb.PIXELS_PER_POINT, _top * Pcb.PIXELS_PER_POINT);

                for (let x = _left + 1; x < _right; ++x)
                    SPRITE_SELECT_TB.draw(x * Pcb.PIXELS_PER_POINT, _top * Pcb.PIXELS_PER_POINT);
            }
            else {
                SPRITE_SELECT_LT.draw(_left * Pcb.PIXELS_PER_POINT, _top * Pcb.PIXELS_PER_POINT);
                SPRITE_SELECT_RT.draw(_right * Pcb.PIXELS_PER_POINT, _top * Pcb.PIXELS_PER_POINT);
                SPRITE_SELECT_LB.draw(_left * Pcb.PIXELS_PER_POINT, _bottom * Pcb.PIXELS_PER_POINT);
                SPRITE_SELECT_RB.draw(_right * Pcb.PIXELS_PER_POINT, _bottom * Pcb.PIXELS_PER_POINT);

                for (let x = _left + 1; x < _right; ++x) {
                    SPRITE_SELECT_T.draw(x * Pcb.PIXELS_PER_POINT, _top * Pcb.PIXELS_PER_POINT);
                    SPRITE_SELECT_B.draw(x * Pcb.PIXELS_PER_POINT, _bottom * Pcb.PIXELS_PER_POINT);
                }

                for (let y = _top + 1; y < _bottom; ++y) {
                    SPRITE_SELECT_L.draw(_left * Pcb.PIXELS_PER_POINT, y * Pcb.PIXELS_PER_POINT);
                    SPRITE_SELECT_R.draw(_right * Pcb.PIXELS_PER_POINT, y * Pcb.PIXELS_PER_POINT);
                }
            }
        }
        else if (_selectable)
            SPRITE_SELECT.draw(cursor.x * Pcb.PIXELS_PER_POINT, cursor.y * Pcb.PIXELS_PER_POINT);
    };
}