import {Drawer} from "../drawer/drawer";

/**
 * The contents of the stored pcbs.
 * @param {User} user The user.
 * @param {Function} setPcb A function that is called when a pcb is selected.
 * @param {Info} info The info box.
 * @param {Boolean} isEditable A boolean that is true if the mission is editable, false otherwise.
 * @constructor
 */
export function LibraryPcbContents(user, setPcb, info, isEditable) {
    const _element = document.createElement("div");
    const _drawers = [];

    const makeDrawer = (drawer) => {
        const newDrawer = new Drawer(user, drawer, setPcb, info, isEditable);

        _drawers.push(newDrawer);
        _element.appendChild(newDrawer.getElement());
    };

    const make = () => {
        _element.id = LibraryPcbContents.ID;

        user.loadDrawers(makeDrawer);
    };

    /**
     * Set the part budget the drawer should respect.
     * @param {BudgetInventory} budget A budget, or null if there is no budget.
     * @param {PartSummary} summary A summary of all the currently used parts.
     * @returns {Boolean} A boolean which is False if the part is not visible.
     */
    this.setBudget = (budget, summary) => {
        for (const drawer of _drawers)
            drawer.setBudget(budget, summary);
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement}
     */
    this.getElement = () => _element;

    make();
}

LibraryPcbContents.ID = "pcb-contents";
LibraryPcbContents.SCROLL_SPEED = 32;