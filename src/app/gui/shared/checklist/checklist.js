import "../../../../styles/checklist.css"
import {ChecklistObjective} from "./checklistObjective";
import {ChecklistTitle} from "./checklistTitle";

/**
 * A checklist displaying all mission objectives.
 * @param {Mission} mission A mission to create a checklist for.
 * @constructor
 */
export function Checklist(mission) {
    const _container = document.createElement("div");
    const _objectives = [];

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
        for (let i = 0; i < _objectives.length; ++i) if (checkMarks[i])
            _objectives[i].check();
    };

    this.getElement = () => _container;

    mission.setOnChange(update);

    build();
}

Checklist.ID = "checklist";