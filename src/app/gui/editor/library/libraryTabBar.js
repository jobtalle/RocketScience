import {LibraryTabButton} from "./libraryTabButton";
import {getString} from "../../../text/language";
import {LibraryPartContents} from "./contents/libraryPartContents";
import {LibraryPcbContents} from "./contents/libraryPcbContents";
import parts from "../../../../assets/parts.json"
import {PcbEditorPlace} from "../pcb/pcbEditorPlace";


/**
 * The Tab Bar that contains the tab buttons.
 * @param {User} user The user.
 * @param {PcbEditor} editor A PcbEditor.
 * @param {Toolbar} toolbar A toolbar to press buttons on.
 * @param {Info} info An information box.
 * @param {LibraryTabContents} tabContent The contents of the tab page.
 * @param {Boolean} isEditable A boolean indicating whether the displayed part budgets are editable.
 * @constructor
 */
export function LibraryTabBar(user, editor, toolbar, info, tabContent, isEditable) {
    const _element = document.createElement("div");
    const _partContents = new LibraryPartContents(parts.categories, (part) => {
            toolbar.default();

            editor.place([new PcbEditorPlace.Fixture(part, 0, 0)]);
        }, editor, info, isEditable);
    let _pcbContents = new LibraryPcbContents(user.getPcbStorage().getDrawers(), (pcb) => {
            toolbar.default();

            editor.placePcb(pcb);
        }, info);

    const _tabs = [
        new LibraryTabButton(
            () => tabContent.setContents(_partContents.getElement()),
            getString("LIBRARY_TABBAR_PARTS"),
            "library-tabbar-parts",
        ),
        new LibraryTabButton(
            () => tabContent.setContents(_pcbContents.getElement()),
            getString("LIBRARY_TABBAR_PCBS"),
            "library-tabbar-pcbs",
        )
    ];

    const make = () => {
        _element.className = LibraryTabBar.CLASS;

        tabContent.setContents(_partContents.getElement());

        for (const button of _tabs)
            _element.appendChild(button.getElement());
    };

    /**
     * Rebuild all the pcb contents from scratch. Should be performed when a saved pcb is added or removed.
     */
    this.rebuildPcbContent = () => {
        _pcbContents = new LibraryPcbContents(user.getPcbStorage().getDrawers(), (pcb) => {
            toolbar.default();

            editor.placePcb(pcb);
        }, info);

        tabContent.setContents(_pcbContents.getElement());
    };

    /**
     * Set the part budget the library should respect.
     * @param {BudgetInventory} budget A budget, or null if there is no budget.
     * @param {PartSummary} summary A summary of all the currently used parts.
     */
    this.setBudget = (budget, summary) => {
        _partContents.setBudget(budget, summary);
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement}
     */
    this.getElement = () => _element;

    make();
}

LibraryTabBar.CLASS = "tab-bar";
