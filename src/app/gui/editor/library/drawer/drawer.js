import {DrawerPcbList} from "./drawerPcbList";
import {DrawerTitle} from "./drawerTitle";

/**
 * A drawer holds all stored pcbs in the library.
 * @param {PcbStorageDrawer} drawer A drawer that holds pcbs
 * @param {String} name The name of the drawer.
 * @param {Function} setPcb The function that is called when the drawerPcb is clicked.
 * @param {Info} info The info panel.
 * @constructor
 */
export function Drawer(drawer, name, setPcb, info) {
    const _element = document.createElement("div");
    const _pcbList = new DrawerPcbList(drawer.getPcbs(), setPcb, info);

    const make = () => {
        _element.className = Drawer.CLASS;
        _element.appendChild(new DrawerTitle(name, _pcbList).getElement());
        _element.appendChild(_pcbList.getElement());
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