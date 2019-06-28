import {Drawer} from "../drawer/drawer";


export function LibraryPcbContents(drawers, info) {
    const _element = document.createElement("div");
    const _drawers = [];


    const make = () => {
        _element.id = LibraryPcbContents.ID;

        // TODO: remove
        _element.appendChild(new Drawer("bla", info).getElement());

        for (const drawer of _drawers) {
            const newDrawer = new Drawer("bla", info);

            _drawers.push(newDrawer);
            _element.appendChild(newDrawer.getElement());
        }
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