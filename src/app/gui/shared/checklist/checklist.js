import "../../../../styles/checklist.css"
import {ChecklistObjective} from "./checklistObjective";
import {ChecklistTitle} from "./checklistTitle";
import {ChecklistFinished} from "./checklistFinished";
import {ChecklistObjectiveNew} from "./checklistObjectiveNew";
import {getString} from "../../../text/language";
import {Objective} from "../../../mission/objective";

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

        const newObjective = new ChecklistObjectiveNew(() => {
            const objective = new Objective(
                [],
                getString(Checklist.TEXT_NEW_OBJECTIVE_TITLE)
            );

            mission.getObjectives().push(objective);

            addObjective(objective, true);
        });

        if (editor)
            _container.appendChild(newObjective.getElement());

        const removeObjective = (objective, checklistObjective) => {
            _objectives.splice(_objectives.indexOf(checklistObjective), 1);
            _container.removeChild(checklistObjective.getElement());

            mission.getObjectives().splice(mission.getObjectives().indexOf(objective), 1);
        };

        const addObjective = (objective, open) => {
            const checklistObjective = new ChecklistObjective(
                objective,
                editor,
                open,
                () => removeObjective(objective, checklistObjective));

            _objectives.push(checklistObjective);

            if (editor)
                _container.insertBefore(checklistObjective.getElement(), newObjective.getElement());
            else
                _container.appendChild(checklistObjective.getElement());
        };

        for (const objective of mission.getObjectives())
            addObjective(objective, false);
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
Checklist.TEXT_NEW_OBJECTIVE_TITLE = "OBJECTIVE_DEFAULT_TITLE";