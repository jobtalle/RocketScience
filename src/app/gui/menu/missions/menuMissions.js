import {MenuMission} from "./mission/menuMission";
import {Menu} from "../menu";
import missions from "../../../../assets/missions.json"

/**
 * A selection of missions that can be started.
 * @param {Menu} menu A menu.
 * @param {User} user The user of the system.
 * @constructor
 */
export function MenuMissions(menu, user) {
    let _element = document.createElement("div");

    const onMissionLoaded = (missionProgress) => {
        _element.appendChild(new MenuMission(menu, missionProgress).getElement());
    };

    const make = () => {
        _element.className = MenuMissions.CLASS;

        user.loadMissionProgresses((missionProgress) => onMissionLoaded(missionProgress),
            (error) => console.log(error));
    };

    /**
     * Reload the element in this menu.
     */
    this.reload = () => {
        _element = document.createElement("div");
        make();
    };

    /**
     * Get the HTML element of this menu.
     * @returns {HTMLElement}
     */
    this.getElement = () => _element;

    make();
}

MenuMissions.CLASS = "missions";
