import {DrawerPcbList} from "./drawerPcbList";
import {DrawerTitle} from "./drawerTitle";

export function Drawer(drawer, name, setPcb, info) {
    const _element = document.createElement("div");
    const _pcbList = new DrawerPcbList(drawer.getPcbs(), setPcb, info);

    const make = () => {
        _element.className = Drawer.CLASS;
        _element.appendChild(new DrawerTitle(name, _pcbList).getElement());
        _element.appendChild(_pcbList.getElement());
    };

    /**
     * Get the HTML element of this category.
     * @returns {HTMLElement} The HTML element of this category.
     */
    this.getElement = () => _element;

    make();
}

Drawer.CLASS = "drawer";
Drawer.EMPTY = "empty";