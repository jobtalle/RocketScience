import {PartSummary} from "../../../../pcb/partSummary";
import {Budget} from "../../../../mission/budget/budget";

/**
 * A specific pcb that is stored in the drawer.
 * @param {User} user The user.
 * @param {StoredPcb} pcb The pcb that is held in the drawer.
 * @param {Function} setPcb The function that is called when the drawerPcb is clicked.
 * @param {Info} info The info panel
 * @param {Boolean} isEditable A boolean that is true if the mission is editable, false otherwise.
 * @constructor
 */
export function DrawerPcb(user, pcb, setPcb, info, isEditable) {
    const _element = document.createElement("div");

    const onClick = () => {
        info.clearText();

        setPcb(pcb.pcb.copy());
    };

    const onEnter = () => {
        info.setPartSummary(new PartSummary(pcb.pcb));
    };

    const onLeave = () => info.clearText();

    const makeField = () => {
        const element = document.createElement("div");

        element.onclick = onClick;
        element.onmouseover = onEnter;
        element.onmouseout = onLeave;

        return element;
    };

    const make = () => {
        _element.classList.add(DrawerPcb.CLASS);
        _element.appendChild(makeField());
    };

    /**
     * Set the part budget the drawer should respect.
     * @param {BudgetInventory} budget A budget, or null if there is no budget.
     * @param {PartSummary} summary A summary of all the currently used parts.
     * @returns {Boolean} A boolean which is False if the part is not visible.
     */
    this.setBudget = (budget, summary) => {
        while (_element.firstChild)
            _element.removeChild(_element.firstChild);

        _element.appendChild(makeField());
        _element.classList.remove(DrawerPcb.CLASS_NOT_AVAILABLE);

        if (isEditable || !budget) {
            return true;
        } else {
            switch (budget.getType()) {
                case Budget.TYPE_INVENTORY:

                    for (const fixture of pcb.pcb.getFixtures()) {
                        const count = budget.getCount(fixture.part.getDefinition().object);

                        const available = count - summary.getPartCount(fixture.part.getDefinition().object);

                        if (available <= 0) {
                            _element.classList.add(DrawerPcb.CLASS_NOT_AVAILABLE);
                            return false;
                        }
                    }

                    return true;
            }
        }
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement} The HTML element.
     */
    this.getElement = () => _element;

    make();
}

DrawerPcb.CLASS_NOT_AVAILABLE = "not-available";
DrawerPcb.CLASS = "drawer-pcb";