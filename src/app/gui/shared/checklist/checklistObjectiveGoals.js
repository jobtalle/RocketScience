/**
 * A list of editable objective goals.
 * @constructor
 */
export function ChecklistObjectiveGoals() {
    const _element = document.createElement("div");

    const make = () => {
        _element.classList.add(ChecklistObjectiveGoals.CLASS);
        _element.classList.add(ChecklistObjectiveGoals.CLASS_HIDDEN);
        _element.innerText = "hello";
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement} The element.
     */
    this.getElement = () => _element;

    /**
     * Toggle visibility.
     */
    this.toggle = () => {
        _element.classList.toggle(ChecklistObjectiveGoals.CLASS_HIDDEN);
    };

    make();
}

ChecklistObjectiveGoals.CLASS = "goals";
ChecklistObjectiveGoals.CLASS_HIDDEN = "hidden";