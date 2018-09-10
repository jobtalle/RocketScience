import {Pcb} from "../../pcb/pcb";

/**
 * A drawable selection rectangle.
 * @param {Sprites} sprites A sprites instance.
 * @constructor
 */
export function Selection(sprites) {
    const SPRITE_SELECT = [sprites.getSprite("pcbSelect"), sprites.getSprite("pcbSelected")];
    const SPRITE_SELECT_LT = [sprites.getSprite("pcbSelectLT"), sprites.getSprite("pcbSelectedLT")];
    const SPRITE_SELECT_RT = [sprites.getSprite("pcbSelectRT"), sprites.getSprite("pcbSelectedRT")];
    const SPRITE_SELECT_LB = [sprites.getSprite("pcbSelectLB"), sprites.getSprite("pcbSelectedLB")];
    const SPRITE_SELECT_RB = [sprites.getSprite("pcbSelectRB"), sprites.getSprite("pcbSelectedRB")];
    const SPRITE_SELECT_T = [sprites.getSprite("pcbSelectT"), sprites.getSprite("pcbSelectedT")];
    const SPRITE_SELECT_B = [sprites.getSprite("pcbSelectB"), sprites.getSprite("pcbSelectedB")];
    const SPRITE_SELECT_L = [sprites.getSprite("pcbSelectL"), sprites.getSprite("pcbSelectedL")];
    const SPRITE_SELECT_R = [sprites.getSprite("pcbSelectR"), sprites.getSprite("pcbSelectedR")];
    const SPRITE_SELECT_LRT = [sprites.getSprite("pcbSelectLRT"), sprites.getSprite("pcbSelectedLRT")];
    const SPRITE_SELECT_LR = [sprites.getSprite("pcbSelectLR"), sprites.getSprite("pcbSelectedLR")];
    const SPRITE_SELECT_LRB = [sprites.getSprite("pcbSelectLRB"), sprites.getSprite("pcbSelectedLRB")];
    const SPRITE_SELECT_LTB = [sprites.getSprite("pcbSelectLTB"), sprites.getSprite("pcbSelectedLTB")];
    const SPRITE_SELECT_TB = [sprites.getSprite("pcbSelectTB"), sprites.getSprite("pcbSelectedTB")];
    const SPRITE_SELECT_RTB = [sprites.getSprite("pcbSelectRTB"), sprites.getSprite("pcbSelectedRTB")];

    const _selected = [];

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
        let mode;

        if (_selected.length > 0)
            mode = 1;
        else
            mode = 0;

        if (_left === _right) {
            if (_top === _bottom)
                SPRITE_SELECT[mode].draw(_left * Pcb.PIXELS_PER_POINT, _top * Pcb.PIXELS_PER_POINT);
            else {
                SPRITE_SELECT_LRT[mode].draw(_left * Pcb.PIXELS_PER_POINT, _top * Pcb.PIXELS_PER_POINT);
                SPRITE_SELECT_LRB[mode].draw(_left * Pcb.PIXELS_PER_POINT, _bottom * Pcb.PIXELS_PER_POINT);

                for (let y = _top + 1; y < _bottom; ++y)
                    SPRITE_SELECT_LR[mode].draw(_left * Pcb.PIXELS_PER_POINT, y * Pcb.PIXELS_PER_POINT);
            }
        }
        else if (_top === _bottom) {
            SPRITE_SELECT_LTB[mode].draw(_left * Pcb.PIXELS_PER_POINT, _top * Pcb.PIXELS_PER_POINT);
            SPRITE_SELECT_RTB[mode].draw(_right * Pcb.PIXELS_PER_POINT, _top * Pcb.PIXELS_PER_POINT);

            for (let x = _left + 1; x < _right; ++x)
                SPRITE_SELECT_TB[mode].draw(x * Pcb.PIXELS_PER_POINT, _top * Pcb.PIXELS_PER_POINT);
        }
        else {
            SPRITE_SELECT_LT[mode].draw(_left * Pcb.PIXELS_PER_POINT, _top * Pcb.PIXELS_PER_POINT);
            SPRITE_SELECT_RT[mode].draw(_right * Pcb.PIXELS_PER_POINT, _top * Pcb.PIXELS_PER_POINT);
            SPRITE_SELECT_LB[mode].draw(_left * Pcb.PIXELS_PER_POINT, _bottom * Pcb.PIXELS_PER_POINT);
            SPRITE_SELECT_RB[mode].draw(_right * Pcb.PIXELS_PER_POINT, _bottom * Pcb.PIXELS_PER_POINT);

            for (let x = _left + 1; x < _right; ++x) {
                SPRITE_SELECT_T[mode].draw(x * Pcb.PIXELS_PER_POINT, _top * Pcb.PIXELS_PER_POINT);
                SPRITE_SELECT_B[mode].draw(x * Pcb.PIXELS_PER_POINT, _bottom * Pcb.PIXELS_PER_POINT);
            }

            for (let y = _top + 1; y < _bottom; ++y) {
                SPRITE_SELECT_L[mode].draw(_left * Pcb.PIXELS_PER_POINT, y * Pcb.PIXELS_PER_POINT);
                SPRITE_SELECT_R[mode].draw(_right * Pcb.PIXELS_PER_POINT, y * Pcb.PIXELS_PER_POINT);
            }
        }
    };

    /**
     * Check if a point lies within this selection.
     * @param {Number} x The X coordinate of the point.
     * @param {Number} y The Y coordinate of the point.
     * @returns {Boolean} A boolean indicating whether the point lies within this selection.
     */
    this.contains = (x, y) => x >= _left && x <= _right && y >= _top && y <= _bottom;

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

    /**
     * Move this selection.
     * @param {Number} x The number of cells to move horizontally.
     * @param {Number} y The number of cells to move vertically.
     */
    this.move = (x, y) => {
        _left += x;
        _right += x;
        _top += y;
        _bottom += y;
    };

    /**
     * Get the selected objects.
     * @returns {Array} An array of selected objects.
     */
    this.getSelected = () => _selected;

    /**
     * Clear all selected objects.
     */
    this.clearSelected = () => _selected.splice(0, _selected.length);

    /**
     * Add an object to the selected object list.
     * @param {Object} object An object to select.
     */
    this.addSelected = object => _selected.push(object);
}