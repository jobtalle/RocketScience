/**
 * The title of a checklist, which is also the mission title.
 * @param {String} title The title.
 * @constructor
 */
export function ChecklistTitle(title) {
    this.getElement = () => {
        const element = document.createElement("div");

        element.className = ChecklistTitle.CLASS;
        element.innerText = title;

        return element;
    };
}

ChecklistTitle.CLASS = "title";