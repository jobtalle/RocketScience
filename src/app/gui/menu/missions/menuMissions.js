import {Mission} from "../../../mission/mission";
import {MenuMission} from "./mission/menuMission";
import {Data} from "../../../file/data";
import {Menu} from "../menu";
import missions from "../../../../assets/missions.json"
import {requestBinary} from "../../../utils/requestBinary";

/**
 * A selection of missions that can be started.
 * @param {Menu} menu A menu.
 * @constructor
 */
export function MenuMissions(menu) {
    const _element = document.createElement("div");

    const make = () => {
        _element.className = MenuMissions.CLASS;

        for (const category of missions.categories) {
            for (const mission of category.missions) {
                const loadData = new Data();

                requestBinary(mission, (result) => {
                    loadData.setBlob(result, () => {
                        _element.appendChild(new MenuMission(menu, Mission.deserialize(loadData.getBuffer())).getElement());
                    });
                }, () => {
                    console.log("ERROR");
                });
            }
        }
    };

    /**
     * Get the HTML element of this menu.
     * @returns {HTMLElement}
     */
    this.getElement = () => _element;

    make();
}

MenuMissions.CLASS = "missions";
