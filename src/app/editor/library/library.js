import "../../../styles/library.css"
import parts from "../../../assets/parts.json"
import {PcbEditorPlace} from "../pcb/pcbEditorPlace";
import {Category} from "./category";
import {CategoryInfo} from "./categoryInfo";

/**
 * An HTML based part library.
 * @param {PcbEditor} editor A PcbEditor which places selected objects.
 * @param {Object} overlay An overlay element for HTML GUI.
 * @param {Number} width The width of the library in pixels.
 * @constructor
 */
export function Library(editor, overlay, width) {
    let _container = null;

    const setPart = part => {
        editor.place([new PcbEditorPlace.Fixture(part, 0, 0)]);
    };


    const build = () => {
        _container = document.createElement("div");
        _container.id = Library.ID;
        _container.style.width = width + "px";

        const info = new CategoryInfo();

        for (const category in parts)
            if (parts.hasOwnProperty(category))
                _container.appendChild(new Category(parts[category], setPart, info.setInfo).getElement());

        _container.appendChild(info.getElement());

        this.show();
    };

    /**
     * Gets the width of the library.
     * @returns {Number} The width in pixels.
     */
    this.getWidth = () => width;

    /**
     * Hide the library. This does not delete the library.
     * It can be shown again later using show().
     */
    this.hide = () => {
        overlay.removeChild(_container);
    };

    /**
     * Show the library.
     */
    this.show = () => {
        overlay.appendChild(_container);
    };

    build();
}

Library.ID = "library";