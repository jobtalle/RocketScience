import {getString} from "../../../text/language";

/**
 * A button that creates a new objective.
 * @param {Function} onClick A function te execute when the button is clicked.
 * @constructor
 */
export function ChecklistObjectiveNew(onClick) {
    const _element = document.createElement("div");

    const make = () => {
        _element.className = ChecklistObjectiveNew.CLASS;
        _element.appendChild(document.createTextNode(getString(ChecklistObjectiveNew.TEXT_BODY)));
        _element.onclick = onClick;
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement} The HTML element.
     */
    this.getElement = () => _element;

    make();
}

ChecklistObjectiveNew.CLASS = "new";
ChecklistObjectiveNew.TEXT_BODY = "OBJECTIVE_NEW";