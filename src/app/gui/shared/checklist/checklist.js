import "../../../../styles/checklist.css"
import {ChecklistObjective} from "./checklistObjective";
import {ChecklistTitle} from "./checklistTitle";
import {ChecklistFinished} from "./checklistFinished";

/**
 * A checklist displaying all mission objectives.
 * @param {Mission} mission A mission to create a checklist for.
 * @param {Game} game The game object.
 * @param {Boolean} editor A boolean indicating whether this checklist is an editor.
 * @constructor
 */
export function Checklist(mission, game, editor) {
    const _container = document.createElement("div");
    const _objectives = [];

    let _finished = false;

    const build = () => {
        _container.id = Checklist.ID;
        _container.appendChild(new ChecklistTitle(mission, editor).getElement());

        for (const objective of mission.getObjectives()) {
            const checklistObjective = new ChecklistObjective(objective, editor);

            _objectives.push(checklistObjective);
            _container.appendChild(checklistObjective.getElement());
        }
    };

    const update = checkMarks => {
        let checked = 0;

        for (let i = 0; i < _objectives.length; ++i) if (checkMarks[i])
            _objectives[i].check(), ++checked;

        if (checked === _objectives.length)
            this.finish();
    };

    /**
     * Set this checklist as completed.
     */
    this.finish = () => {
        if (_finished)
            return;

        for (const objective of _objectives)
            objective.check();

        _container.appendChild(new ChecklistFinished(game).getElement());
        _finished = true;
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement} The HTML element.
     */
    this.getElement = () => _container;

    if (!editor)
        mission.setOnChange(update);

    build();
}

Checklist.ID = "checklist";