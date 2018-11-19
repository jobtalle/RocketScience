import {getString} from "../../../text/language";

/**
 * A button that appears on the checklist once all objectives are met.
 * @constructor
 */
export function ChecklistFinished() {
    const _element = document.createElement("div");

    const make = () => {
        _element.className = ChecklistFinished.CLASS;
        _element.appendChild(document.createTextNode(getString(ChecklistFinished.TEXT)));
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement} The HTML element.
     */
    this.getElement = () => _element;

    make();
}

ChecklistFinished.CLASS = "finished";
ChecklistFinished.TEXT = "CHECKLIST_FINISHED";