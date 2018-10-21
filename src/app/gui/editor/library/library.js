import "../../../../styles/library.css"
import parts from "../../../../assets/parts.json"
import {PcbEditorPlace} from "../pcb/pcbEditorPlace";
import {Category} from "./category";
import {Toolbar} from "../toolbar/toolbar";
import {Info} from "../info/info";

/**
 * An HTML based part library.
 * @param {PcbEditor} editor A PcbEditor which places selected objects.
 * @param {Toolbar} toolbar A toolbar to press buttons on.
 * @param {Info} info An information box.
 * @param {Object} overlay An element to place the library on.
 * @constructor
 */
export function Library(editor, toolbar, info, overlay) {
    const _container = document.createElement("div");
    const _categories = [];

    let _budget = null;
    let _pcb = null;

    const updateBudget = () => {
        if (!_budget)
            return;


    };

    const setPart = part => {
        toolbar.default();

        editor.place([new PcbEditorPlace.Fixture(part, 0, 0)]);
    };

    const build = () => {
        _container.id = Library.ID;

        const _parts = document.createElement("div");

        _parts.id = Library.PARTS_ID;

        for (const category in parts) if (parts.hasOwnProperty(category)) {
            const categoryElement = new Category(parts[category], setPart, info);

            _categories.push(categoryElement);
            _parts.appendChild(categoryElement.getElement());
        }

        _container.appendChild(_parts);
        _container.appendChild(info.getElement());
        _container.appendChild(info.getExtension());
    };

    this.setBudget = (budget, pcb) => {
        _budget = budget;
        _pcb = pcb;

        updateBudget();
    };

    /**
     * Hide the library. This does not delete the library.
     * It can be shown again later using show().
     */
    this.hide = () => {
        overlay.removeChild(_container);

        info.hide();
    };

    /**
     * Show the library.
     */
    this.show = () => {
        overlay.appendChild(_container);

        info.show();
    };

    build();
}

Library.ID = "library";
Library.PARTS_ID = "parts";