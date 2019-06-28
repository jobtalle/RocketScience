import {LibraryTabButton} from "./libraryTabButton";
import {getString} from "../../../text/language";
import {LibraryPartContents} from "./contents/libraryPartContents";
import {LibraryPcbContents} from "./contents/libraryPcbContents";
import parts from "../../../../assets/parts.json"
import {PcbEditorPlace} from "../pcb/pcbEditorPlace";


export function LibraryTabBar(editor, toolbar, info, tabContent, isEditable) {
    const _element = document.createElement("div");
    const _libraryTab = new LibraryPartContents(parts.categories, (part) => {
        toolbar.default();

        editor.place([new PcbEditorPlace.Fixture(part, 0, 0)]);
    }, editor, info, isEditable);

    const _tabs = [
        new LibraryTabButton(
            (content) => tabContent.setContents(content.getElement()),
            getString("LIBRARY_TABBAR_PARTS"),
            "library-tabbar-parts",
            _libraryTab
        ),
        new LibraryTabButton(
            (content) => tabContent.setContents(content.getElement()),
            getString("LIBRARY_TABBAR_PCBS"),
            "library-tabbar-pcbs",
            new LibraryPcbContents([], info)
        )
    ];

    const make = () => {
        _element.className = LibraryTabBar.CLASS;

        tabContent.setContents(_libraryTab.getElement());

        for (const button of _tabs)
            _element.appendChild(button.getElement());
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
     * Get the HTML element.
     * @returns {HTMLElement}
     */
    this.getElement = () => _element;

    make();
}

LibraryTabBar.CLASS = "tab-bar";
