import {Pcb} from "../../pcb/pcb";
import Myr from "myr.js"
import {EditableRegion} from "./editableRegion";
import {BudgetInventory} from "../budget/budgetInventory";
import {UndoStack} from "../../gui/editor/pcb/undoStack";
import {Scale} from "../../world/scale";

/**
 * A definition of an editable PCB (and its part budget).
 * @param {EditableRegion} region The editable region of this editable.
 * @param {Pcb} pcb The default pcb for this editable.
 * @param {Myr.Vector} pcbOffset The PCB's offset within its region.
 * @param {Object} budget A part budget, or null if there is no budget.
 * @constructor
 */
export function Editable(region, pcb, pcbOffset, budget) {
    const _position = new Myr.Vector(0, 0);
    const _undoStack = new UndoStack(this);

    const calculatePosition = () => {
        _position.x = region.getOrigin().x + pcbOffset.x;
        _position.y = region.getOrigin().y + pcbOffset.y;
    };

    /**
     * Get the undo stack of this editable.
     * @returns {UndoStack}
     */
    this.getUndoStack = () => _undoStack;

    /**
     * Get the region this editable is in.
     * @returns {EditableRegion}
     */
    this.getRegion = () => region;

    /**
     * Set the region this editable is in.
     * @param {EditableRegion} newRegion An EditableRegion instance.
     */
    this.setRegion = newRegion => region = newRegion;

    /**
     * Get the PCB of this editable.
     * @returns {Pcb} A pcb.
     */
    this.getPcb = () => pcb;

    /**
     * Update the pcb of this editable.
     * @param {Pcb} newPcb A new root pcb.
     */
    this.setPcb = newPcb => pcb = newPcb;

    /**
     * Get the part budget of this editable.
     * @returns {Object} A part budget.
     */
    this.getBudget = () => budget;

    /**
     * Set a new budget for this editable.
     * @param {Object} newBudget A valid budget object or null for an infinite budget.
     */
    this.setBudget = newBudget => budget = newBudget;

    /**
     * Get the offset of the pcb in the editable region.
     * @returns {Myr.Vector} The offset in meters.
     */
    this.getOffset = () => pcbOffset;

    /**
     * Move the PCB offset in the editable region.
     * @param {Number} dx The horizontal movement in meters.
     * @param {Number} dy The vertical movement in meters.
     */
    this.moveOffset = (dx, dy) => {
        pcbOffset.x += dx;
        pcbOffset.y += dy;

        calculatePosition();
    };

    /**
     * Shift the region position.
     * @param {Number} dx The horizontal movement in meters.
     * @param {Number} dy The vertical movement in meters.
     */
    this.moveRegion = (dx, dy) => {
        region.moveOrigin(dx, dy);

        calculatePosition();
    };

    /**
     * Resize the region.
     * @param {Number} dx The horizontal change in meters.
     * @param {Number} dy The vertical change in meters.
     */
    this.resizeRegion = (dx, dy) => region.resize(dx, dy);

    /**
     * Rounds all coordinates to the grid. This method should not change the current coordinates, but should be a safeguard against rounding errors.
     */
    this.roundCoordinatesToGrid = () => {
        region.roundCoordinatesToGrid();
        pcbOffset.x = Math.round(pcbOffset.x * Scale.POINTS_PER_METER) * Scale.METERS_PER_POINT;
        pcbOffset.y = Math.round(pcbOffset.y * Scale.POINTS_PER_METER) * Scale.METERS_PER_POINT;
    };

    /**
     * Get the PCB position in the world.
     * @returns {Myr.Vector} The PCB position in the world in meters.
     */
    this.getPosition = () => _position;

    /**
     * Make a copy of this editable.
     * @return {Object} A deep copy.
     */
    this.copy = () => {
        if (budget)
            return new Editable(region.copy(), pcb.copy(), pcbOffset.copy(), budget.copy());

        return new Editable(region.copy(), pcb.copy(), pcbOffset.copy(), null);
    };

    /**
     * Serialize this editable.
     * @param {ByteBuffer} buffer A byte buffer to serialize to.
     */
    this.serialize = buffer => {
        let header = (this.getBudget() === null)?Editable.SERIALIZE_BIT_BUDGET_NULL:0;
        buffer.writeByte(header);

        this.getRegion().serialize(buffer);
        this.getPcb().serialize(buffer);

        buffer.writeFloat(this.getOffset().x);
        buffer.writeFloat(this.getOffset().y);

        if (!(header & Editable.SERIALIZE_BIT_BUDGET_NULL))
            this.getBudget().serialize(buffer);
    };

    calculatePosition();
}

Editable.deserialize = buffer => {
    let header = buffer.readByte();

    let region = EditableRegion.deserialize(buffer);
    let pcb = Pcb.deserialize(buffer);
    let offset = new Myr.Vector(buffer.readFloat(), buffer.readFloat());
    let budget = null;

    if (!(header & Editable.SERIALIZE_BIT_BUDGET_NULL))
        budget = BudgetInventory.deserialize(buffer);

    return new Editable(region, pcb, offset, budget);
};

/**
 * Return a default editable at given position.
 * @param {Myr.Vector} position Position of new Editable.
 * @returns {Editable}
 */
Editable.defaultEditable = (position) => {
    const pcb = new Pcb();
    pcb.initialize();

    return new Editable(new EditableRegion(position, new Myr.Vector(5, 5)), pcb, new Myr.Vector(1, 1), null);
};

Editable.SERIALIZE_BIT_BUDGET_NULL = 0x10;