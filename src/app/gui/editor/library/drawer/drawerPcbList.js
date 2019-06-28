import {DrawerPcb} from "./drawerPcb";

export function DrawerPcbList(info) {
    const _element = document.createElement("div");
    const _pcbs = [];

    const make = () => {
        _element.className = DrawerPcbList.CLASS;

        _element.appendChild(new DrawerPcb(null, ()=> {}, info).getElement());

        for (const pcb of _pcbs) {
            // TODO: add args
            const newPcb = new DrawerPcb(pcb, (pcb) => {}, info);

            _element.appendChild(newPcb.getElement());
            _pcbs.push(newPcb);
        }
    };

    /**
     * Toggle expand or collapse state.
     */
    this.toggle = () => _element.classList.toggle(DrawerPcbList.CLASS_CLOSED);

    /**
     * Get the HTML element of this part list.
     * @returns {HTMLElement} The HTML element of this part list.
     */
    this.getElement = () => _element;

    make();
}

DrawerPcbList.CLASS = "pcb-list";
DrawerPcbList.CLASS_CLOSED = "closed";