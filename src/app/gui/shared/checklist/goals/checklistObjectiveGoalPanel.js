/**
 * A panel to add goal editor components to.
 * @constructor
 */
export function ChecklistObjectiveGoalPanel() {
    const _element = document.createElement("div");

    const make = () => {
        _element.className = ChecklistObjectiveGoalPanel.CLASS;
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement} The HTML element.
     */
    this.getElement = () => _element;

    make();
}

ChecklistObjectiveGoalPanel.CLASS = "goal";