import {Myr} from "./../../lib/myr.js"

/**
 * A profile specifying shift behavior.
 * @param {Number} step The smallest amount of shift possible.
 * @constructor
 */
export function ShiftProfile(step) {
    const _shift = new Myr.Vector(0, 0);

    const applyStep = zoom => {
        if (step > 0) {
            const s = step / zoom;

            _shift.x = Math.round(_shift.x / s) * s;
            _shift.y = Math.round(_shift.y / s) * s;
        }
    };

    /**
     * Move the shift.
     * @param {Number} x The horizontal shift.
     * @param {Number} y The vertical shift.
     * @param {Number} zoom The current zoom level.
     */
    this.shift = (x, y, zoom) => {
        _shift.x += x;
        _shift.y += y;

        applyStep(zoom);
    };

    /**
     * Set the shift.
     * @param {Number} x The horizontal shift.
     * @param {Number} y The vertical shift.
     * @param {Number} zoom The current zoom level.
     */
    this.setShift = (x, y, zoom) => {
        _shift.x = x;
        _shift.y = y;

        applyStep(zoom);
    };

    /**
     * Returns the current shift.
     * @returns {Myr.Vector} The current shift.
     */
    this.getShift = () => _shift;
}