import {getString} from "../../../../text/language";

/**
 * A panel to add goal editor components to.
 * @param {String} title The title text label.
 * @param {String} description The description text label.
 * @param {Function} onDelete A function to call when the objective should be deleted.
 * @constructor
 */
export function ChecklistObjectiveGoalPanel(title, description, onDelete) {
    const _element = document.createElement("div");

    const makeDelete = () => {
        const element = document.createElement("button");

        element.onclick = onDelete;
        element.innerText = getString(ChecklistObjectiveGoalPanel.TEXT_DELETE);

        return element;
    };

    const _deleteButton = makeDelete();

    const makeTitle = () => {
        const element = document.createElement("h1");

        element.appendChild(document.createTextNode(getString(title)));

        return element;
    };

    const make = () => {
        _element.className = ChecklistObjectiveGoalPanel.CLASS;
        _element.appendChild(makeTitle());
        _element.appendChild(document.createTextNode(getString(description)));
        _element.appendChild(_deleteButton);
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement} The HTML element.
     */
    this.getElement = () => _element;

    /**
     * Add an element to the panel.
     * @param {HTMLElement} element An HTML element.
     */
    this.add = element => {
        _element.insertBefore(element, _deleteButton);
    };

    make();
}

ChecklistObjectiveGoalPanel.CLASS = "goal";
ChecklistObjectiveGoalPanel.TEXT_DELETE = "GOAL_DELETE";