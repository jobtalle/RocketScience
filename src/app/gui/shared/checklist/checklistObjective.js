/**
 * An objective for the checklist GUI.
 * @param {String} description A description of this objective.
 * @constructor
 */
export function ChecklistObjective(description) {
    const _element = document.createElement("div");

    const build = () => {
        _element.className = ChecklistObjective.CLASS;
        _element.innerText = description;
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