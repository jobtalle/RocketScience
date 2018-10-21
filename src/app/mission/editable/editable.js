import {Pcb} from "../../pcb/pcb";
import Myr from "../../../lib/myr.js";
import {Terrain} from "../../world/terrain/terrain";

/**
 * A definition of an editable PCB (and its part budget).
 * @param {EditableRegion} region The editable region of this editable.
 * @param {Pcb} pcb The default pcb for this editable.
 * @param {Budget} budget A part budget, or null if there is no budget.
 * @constructor
 */
export function Editable(region, pcb, budget) {
    const _pcbOffset = new Myr.Vector(
        (region.getSize().x - pcb.getWidth() * Terrain.METERS_PER_PIXEL * Pcb.PIXELS_PER_POINT) / 2,
        (region.getSize().y - pcb.getHeight() * Terrain.METERS_PER_PIXEL * Pcb.PIXELS_PER_POINT) / 2);

    /**
     * Get the region this editable is in.
     * @returns {EditableRegion}
     */
    this.getRegion = () => region;

    /**
     * Get the PCB of this editable.
     * @returns {Pcb} A pcb.
     */
    this.getPcb = () => pcb;

    /**
     * Get the part budget of this editable.
     * @returns {Budget} A part budget.
     */
    this.getBudget = () => budget;

    /**
     * Get the offset of the pcb in the editable region.
     * @returns {Myr.Vector} The offset in meters.
     */
    this.getOffset = () => _pcbOffset;
}