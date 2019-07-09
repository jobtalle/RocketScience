import {PartSummary} from "../../../../pcb/partSummary";

/**
 * A specific pcb that is stored in the drawer.
 * @param {Pcb} pcb The pcb that is held in the drawer.
 * @param {Function} setPcb The function that is called when the drawerPcb is clicked.
 * @param {Info} info The info panel
 * @constructor
 */
export function DrawerPcb(pcb, setPcb, info) {
    const _element = document.createElement("div");

    const onClick = () => {
        info.clearText();

        setPcb(pcb.copy());
    };

    const onEnter = () => {
        info.setPartSummary(new PartSummary(pcb));
    };

    const onLeave = () => info.clearText();

    const makeSprite = () => {
        const element = document.createElement("div");

        element.classList.add("sprite");
        element.classList.add("library-stored-pcb");
        element.onclick = onClick;
        element.onmouseover = onEnter;
        element.onmouseout = onLeave;

        return element;
    };

    const make = () => {
        _element.classList.add(DrawerPcb.CLASS);
        _element.appendChild(makeSprite());
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement} The HTML element.
     */
    this.getElement = () => _element;

    make();
}

DrawerPcb.CLASS = "drawer-pcb";