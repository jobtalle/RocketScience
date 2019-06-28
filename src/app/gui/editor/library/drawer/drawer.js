import {DrawerPcbList} from "./drawerPcbList";
import {DrawerTitle} from "./drawerTitle";

export function Drawer(name, info) {
    const _element = document.createElement("div");
    const _pcbList = new DrawerPcbList(info);

    const make = () => {
        _element.className = Drawer.CLASS;
        _element.appendChild(new DrawerTitle("title", _pcbList).getElement());
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