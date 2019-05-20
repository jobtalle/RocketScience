/**
 * An objective for the checklist GUI.
 * @param {Objective} objective An objective.
 * @param {Boolean} editor A boolean indicating whether this objective is an editor.
 * @constructor
 */
import {ChecklistObjectiveGoals} from "./checklistObjectiveGoals";

export function ChecklistObjective(objective, editor) {
    const _element = document.createElement("div");

    const makeField = () => {
        const element = document.createElement("input");

        element.value = objective.getTitle();
        element.onkeydown = element.onkeyup = event => event.stopPropagation();
        element.oninput = () => {
            objective.setTitle(element.value);
        };

        return element;
    };

    const makeToggle = goals => {
        const element = document.createElement("button");

        element.innerText = ChecklistObjective.TEXT_EDIT;
        element.onclick = goals.toggle;

        return element;
    };

    const makeEditor = goals => {
        const element = document.createElement("div");

        element.className = ChecklistObjective.CLASS_INPUT;
        element.appendChild(makeField());
        element.appendChild(makeToggle(goals));

        return element;
    };

    const build = () => {
        _element.className = ChecklistObjective.CLASS;

        if (editor) {
            const goals = new ChecklistObjectiveGoals();

            _element.appendChild(makeEditor(goals));
            _element.appendChild(goals.getElement());
        }
        else
            _element.innerText = objective.getTitle();
    };

    /**
     * Get this objectives' HTML element.
     * @returns {HTMLElement} This objects HTML element.
     */
    this.getElement = () => _element;

    /**
     * Mark this objective as finished.
     */
    this.check = () => {
        _element.classList.add(ChecklistObjective.CLASS_CHECKED);
    };

    build();
}

ChecklistObjective.CLASS = "objective";
ChecklistObjective.CLASS_CHECKED = "checked";
ChecklistObjective.CLASS_INPUT = "field";
ChecklistObjective.TEXT_EDIT = String.fromCharCode(9660);