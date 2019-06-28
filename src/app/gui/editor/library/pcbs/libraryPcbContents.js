import {Drawer} from "../drawer/drawer";


export function LibraryPcbContents(drawers, info) {
    const _element = document.createElement("div");
    const _drawers = [];

    const scroll = delta => {
        _element.scrollTop += delta;
    };

    const scrollReset = () => {
        _element.scrollTop = 0;
    };

    const make = () => {
        _element.id = LibraryPcbContents.ID;

        _element.addEventListener("wheel", event => {
            if (event.deltaY < 0)
                scroll(-LibraryPcbContents.SCROLL_SPEED);
            else
                scroll(LibraryPcbContents.SCROLL_SPEED);
        });

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