import "../../../../styles/library.css"
import parts from "../../../../assets/parts.json"
import {PcbEditorPlace} from "../pcb/pcbEditorPlace";
import {Toolbar} from "../toolbar/toolbar";
import {Info} from "../info/info";
import {LibraryTabBar} from "./libraryTabBar";

/**
 * An HTML based part library.
 * @param {PcbEditor} editor A PcbEditor.
 * @param {Toolbar} toolbar A toolbar to press buttons on.
 * @param {Info} info An information box.
 * @param {Object} overlay An element to place the library on.
 * @param {Boolean} isEditable A boolean indicating whether the displayed part budgets are editable.
 * @constructor
 */
export function Library(editor, toolbar, info, overlay, isEditable) {
    const _container = document.createElement("div");
    const _libraryTab = new LibraryTabBar(editor, toolbar, info, isEditable);

    const build = () => {
        _container.id = Library.ID;

        _container.appendChild(_libraryTab.getElement());
        _container.appendChild(info.getElement());
        _container.appendChild(info.getExtension());
    };

    /**
     * Set the part budget the library should respect.
     * @param {BudgetInventory} budget A budget, or null if there is no budget.
     * @param {PartSummary} summary A summary of all the currently used parts.
     */
    this.setBudget = (budget, summary) => {
        _libraryTab.setBudget(budget, summary);
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