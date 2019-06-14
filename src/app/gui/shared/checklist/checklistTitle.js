/**
 * The title of a checklist, which is also the mission title.
 * @param {Mission} mission A mission to show the title for.
 * @param {Boolean} editor A boolean indicating whether this title is an editor.
 * @constructor
 */
export function ChecklistTitle(mission, editor) {
    const _element = document.createElement("div");

    const makeField = () => {
        const element = document.createElement("input");

        element.value = mission.getTitle();
        element.onkeydown = element.onkeyup = event => event.stopPropagation();
        element.oninput = () => {
            mission.setTitle(element.value);
        };

        return element;
    };

    const make = () => {
        _element.className = ChecklistTitle.CLASS;

        if (editor)
            _element.appendChild(makeField());
        else
            _element.innerText = mission.getTitle();
    };

    /**
     * Get  the HTML element.
     * @returns {HTMLElement} The element.
     */
    this.getElement = () => _element;

    make();
}

ChecklistTitle.CLASS = "title";