import {DrawerPcbList} from "./drawerPcbList";
import {DrawerTitle} from "./drawerTitle";

/**
 * A drawer holds all stored pcbs in the library.
 * @param {User} user The user.
 * @param {PcbStorageDrawer} drawer A drawer that holds pcbs
 * @param {Function} setPcb The function that is called when the drawerPcb is clicked.
 * @param {Info} info The info panel.
 * @param {Boolean} isEditable A boolean that states if the mission is editable or not.
 * @constructor
 */
export function Drawer(user, drawer, setPcb, info, isEditable) {
    const _element = document.createElement("div");
    const _pcbList = new DrawerPcbList(user, drawer.getPcbs(), setPcb, info, isEditable);

    const make = () => {
        _element.className = Drawer.CLASS;
        _element.appendChild(new DrawerTitle(user, drawer, _pcbList).getElement());
        _element.appendChild(_pcbList.getElement());
    };

    /**
     * Set the part budget the drawer should respect.
     * @param {BudgetInventory} budget A budget, or null if there is no budget.
     * @param {PartSummary} summary A summary of all the currently used parts.
     * @returns {Boolean} A boolean which is False if the part is not visible.
     */
    this.setBudget = (budget, summary) => {
        _pcbList.setBudget(budget, summary);
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement} The HTML element.
     */
    this.getElement = () => _element;

    make();
}

Drawer.CLASS = "drawer";
Drawer.EMPTY = "empty";