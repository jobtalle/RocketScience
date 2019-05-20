/**
 * The title of a checklist, which is also the mission title.
 * @param {Mission} mission A mission to show the title for.
 * @param {Boolean} editor A boolean indicating whether this title is an editor.
 * @constructor
 */
export function ChecklistTitle(mission, editor) {
    this.getElement = () => {
        const element = document.createElement("div");

        element.className = ChecklistTitle.CLASS;
        element.innerText = mission.getTitle();

        return element;
    };
}

ChecklistTitle.CLASS = "title";