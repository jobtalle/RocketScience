import {Pcb} from "../../pcb/pcb";

/**
 * A drawable selection rectangle.
 * @param {Sprites} sprites A sprites instance.
 * @constructor
 */
export function Selection(sprites) {
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

    let _left = 0;
    let _top = 0;
    let _right = 0;
    let _bottom = 0;

    /**
     * Set this selections region.
     * @param {Number} left The leftmost selected cell.
     * @param {Number} right The rightmost selected cell.
     * @param {Number} top The topmost selected cell.
     * @param {Number} bottom The bottommost selected cell.
     */
    this.setRegion = (left, right, top, bottom) => {
        _left = left;
        _right = right;
        _top = top;
        _bottom = bottom;
    };

    /**
     * Draw the selection.
     */
    this.draw = () => {
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
    };

    /**
     * Check if a point lies within this selection.
     * @param {Number} x The X coordinate of the point.
     * @param {Number} y The Y coordinate of the point.
     * @returns {Boolean} A boolean indicating whether the point lies within this selection.
     */
    this.contains = (x, y) => {
        return x >= _left && x <= _right && y >= _top && y <= _bottom;
    };

    /**
     * Get the leftmost cell of this selection.
     * @returns {Number} The leftmost cell.
     */
    this.getLeft = () => _left;

    /**
     * Get the rightmost cell of this selection.
     * @returns {Number} The rightmost cell.
     */
    this.getRight = () => _right;

    /**
     * Get the topmost cell of this selection.
     * @returns {Number} The topmost cell.
     */
    this.getTop = () => _top;

    /**
     * Get the bottommost cell of this selection.
     * @returns {Number} The bottommost cell.
     */
    this.getBottom = () => _bottom;
}