/**
 * An objective for the checklist GUI.
 * @param {Objective} objective An objective.
 * @param {Boolean} editor A boolean indicating whether this objective is an editor.
 * @constructor
 */
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

    const build = () => {
        _element.className = ChecklistObjective.CLASS;

        if (editor)
            _element.appendChild(makeField());
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