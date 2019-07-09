import {DrawerPcb} from "./drawerPcb";

/**
 * A drawer pcb list holds all the pcbs of a drawer.
 * @param {[Pcb]} pcbs A list of pcbs
 * @param {Function} setPcb The function that must be called when the pcb is clicked.
 * @param {Info} info The info panel.
 * @constructor
 */
export function DrawerPcbList(pcbs, setPcb, info) {
    const _element = document.createElement("div");
    const _pcbDrawers = [];

    const make = () => {
        _element.className = DrawerPcbList.CLASS;

        for (const pcb of pcbs) {
            const newPcb = new DrawerPcb(pcb, setPcb, info);

            _element.appendChild(newPcb.getElement());
            _pcbDrawers.push(newPcb);
        }
    };

    /**
     * Toggle expand or collapse state.
     */
    this.toggle = () => _element.classList.toggle(DrawerPcbList.CLASS_CLOSED);

    /**
     * Get the HTML element.
     * @returns {HTMLElement} The HTML element of this part list.
     */
    this.getElement = () => _element;

    make();
}

DrawerPcbList.CLASS = "pcb-list";
DrawerPcbList.CLASS_CLOSED = "closed";