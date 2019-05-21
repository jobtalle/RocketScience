import {getString} from "../../../../text/language";

/**
 * A panel to add goal editor components to.
 * @param {String} title The title text label.
 * @param {String} description The description text label.
 * @constructor
 */
export function ChecklistObjectiveGoalPanel(title, description) {
    const _element = document.createElement("div");

    const makeTitle = () => {
        const element = document.createElement("h1");

        element.appendChild(document.createTextNode(getString(title)));

        return element;
    };

    const make = () => {
        _element.className = ChecklistObjectiveGoalPanel.CLASS;
        _element.appendChild(makeTitle());
        _element.appendChild(document.createTextNode(getString(description)));
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement} The HTML element.
     */
    this.getElement = () => _element;

    make();
}

ChecklistObjectiveGoalPanel.CLASS = "goal";