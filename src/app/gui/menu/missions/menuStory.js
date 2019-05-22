import {MenuMission} from "./mission/menuMission";
import {Menu} from "../menu";

/**
 * A selection of missions that can be started.
 * @param {Story} story A story.
 * @param {Menu} menu A menu.
 * @param {User} user The user of the system.
 * @constructor
 */
export function MenuStory(story, menu, user) {
    let _element = document.createElement("div");

    // const onMissionLoaded = (missionProgress) => {
    //     const count = _element.childElementCount + 1;
    //
    //     const onLoad = (result) => {
    //         const removeElement = _element.getChildren()[count];
    //
    //         _element.insertItemBefore(new MenuMission(menu, result, onUpdate).getElement(), count);
    //
    //         _element.removeChild(removeElement);
    //     };
    //
    //     const onUpdate = () => {
    //         user.clearMission(missionProgress.getMission().getTitle());
    //
    //         user.loadMissionProgress(missionProgress.getMission().getTitle(),
    //             (result) => onLoad(result),
    //             () => (console.log("error!")));
    //     };
    //
    //     _element.appendChild(new MenuMission(menu, missionProgress, onUpdate).getElement());
    // };

    const make = () => {
        _element.className = MenuStory.CLASS;

        for (const mission of story.getMissions()) {
            _element.appendChild(new MenuMission(menu, mission, () => {}).getElement());
        }
    };

    /**
     * Get the HTML element of this menu.
     * @returns {HTMLElement}
     */
    this.getElement = () => _element;

    make();
}

MenuStory.CLASS = "story";
