import {DrawerPcb} from "./drawerPcb";

/**
 * A drawer pcb list holds all the storedPcbs of a drawer.
 * @param {User} user The user.
 * @param {[StoredPcb]} storedPcbs A list of storedPcbs
 * @param {Function} setPcb The function that must be called when the pcb is clicked.
 * @param {Info} info The info panel.
 * @param {Boolean} isEditable A boolean that is true if the mission is editable, false otherwise.
 * @constructor
 */
export function DrawerPcbList(user, storedPcbs, setPcb, info, isEditable) {
    const _element = document.createElement("div");
    const _pcbDrawers = [];

    const make = () => {
        _element.className = DrawerPcbList.CLASS;

        for (const pcb of storedPcbs) {
            const newPcb = new DrawerPcb(user, pcb, setPcb, info, isEditable);

            _element.appendChild(newPcb.getElement());
            _pcbDrawers.push(newPcb);
        }
    };

    /**
     * Toggle expand or collapse state.
     */
    this.toggle = () => _element.classList.toggle(DrawerPcbList.CLASS_CLOSED);

    /**
     * Set the part budget the drawer should respect.
     * @param {BudgetInventory} budget A budget, or null if there is no budget.
     * @param {PartSummary} summary A summary of all the currently used parts.
     * @returns {Boolean} A boolean which is False if the part is not visible.
     */
    this.setBudget = (budget, summary) => {
        for (const pcbDrawer of _pcbDrawers)
            pcbDrawer.setBudget(budget, summary);
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement} The HTML element.
     */
    this.getElement = () => _element;

    make();
}

DrawerPcbList.CLASS = "pcb-list";
DrawerPcbList.CLASS_CLOSED = "closed";