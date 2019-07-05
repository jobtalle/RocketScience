import {Drawer} from "../drawer/drawer";
import {getString} from "../../../../text/language";


export function LibraryPcbContents(drawers, setPcb, info) {
    const _element = document.createElement("div");
    const _drawers = [];


    const make = () => {
        _element.id = LibraryPcbContents.ID;

        let index = 1;
        for (const drawer of drawers) {
            const newDrawer = new Drawer(drawer, getString(LibraryPcbContents.DRAWER_NAME) + " " + index.toString(), setPcb, info);

            _drawers.push(newDrawer);
            _element.appendChild(newDrawer.getElement());
            ++index;
        }
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement}
     */
    this.getElement = () => _element;

    make();
}

LibraryPcbContents.DRAWER_NAME = "DRAWER_NAME";
LibraryPcbContents.ID = "pcb-contents";
LibraryPcbContents.SCROLL_SPEED = 32;