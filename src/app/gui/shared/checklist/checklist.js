import "../../../../styles/checklist.css"
import {ChecklistObjective} from "./checklistObjective";
import {ChecklistTitle} from "./checklistTitle";
import {ChecklistFinished} from "./checklistFinished";

/**
 * A checklist displaying all mission objectives.
 * @param {Mission} mission A mission to create a checklist for.
 * @param {Game} game The game object.
 * @param {Mission} [listenTo] An optional mission to synchronize the list to.
 * @constructor
 */
export function Checklist(mission, game, listenTo) {
    const _container = document.createElement("div");
    const _objectives = [];

    let _finished = false;

    const build = () => {
        _container.id = Checklist.ID;

        _container.appendChild(new ChecklistTitle(mission.getTitle()).getElement());

        for (const objective of mission.getObjectives()) {
            const checklistObjective = new ChecklistObjective(objective.getName());

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

    if (listenTo)
        listenTo.setOnChange(update);

    build();
}

Checklist.ID = "checklist";