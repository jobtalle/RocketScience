import {ChecklistObjectiveGoals} from "./checklistObjectiveGoals";

/**
 * An objective for the checklist GUI.
 * @param {Objective} objective An objective.
 * @param {Boolean} editor A boolean indicating whether this objective is an editor.
 * @param {Boolean} open A boolean indicating whether this objective should be expanded initially.
 * @param {Function} onDelete A function to call when this objective wants to delete itself.
 * @constructor
 */
export function ChecklistObjective(objective, editor, open, onDelete) {
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

        element.innerText = ChecklistObjective.TEXT_EXPAND;
        element.onclick = () => {
            goals.toggle();

            if (element.innerText === ChecklistObjective.TEXT_EXPAND)
                element.innerText = ChecklistObjective.TEXT_COLLAPSE;
            else
                element.innerText = ChecklistObjective.TEXT_EXPAND;
        };

        return element;
    };

    const makeDelete = () => {
        const element = document.createElement("button");

        element.innerText = ChecklistObjective.TEXT_DELETE;

        if (onDelete)
            element.onclick = onDelete;

        return element;
    };

    const makeEditor = goals => {
        const element = document.createElement("div");
        const toggle = makeToggle(goals);

        element.className = ChecklistObjective.CLASS_INPUT;
        element.appendChild(makeField());
        element.appendChild(toggle);
        element.appendChild(makeDelete());

        if (open)
            toggle.click();

        return element;
    };

    const build = () => {
        _element.className = ChecklistObjective.CLASS;

        if (editor) {
            const goals = new ChecklistObjectiveGoals(objective);

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
ChecklistObjective.TEXT_EXPAND = String.fromCharCode(9660);
ChecklistObjective.TEXT_COLLAPSE = String.fromCharCode(9650);
ChecklistObjective.TEXT_DELETE = String.fromCharCode(10006);