import {MenuMission} from "./mission/menuMission";
import {Menu} from "../menu";

/**
 * A selection of missions that can be started.
 * @param {Story} story A story.
 * @param {Menu} menu A menu.
 * @param {User} user The user of the system.
 * @param {Function} onUpdate Function that is called when the object is updated.
 * @constructor
 */
export function MenuStory(story, menu, user, onUpdate) {
    const _element = document.createElement("div");

    const make = () => {
        _element.className = MenuStory.CLASS;

        for (const mission of story.getMissions()) {
            _element.appendChild(new MenuMission(menu, mission, () => onUpdate(mission, story, _element)).getElement());
        }
    };

    /**
     * Get the name of the Story.
     * @return {String} The name of the story.
     */
    this.getName = () => story.label;

    /**
     * Get the HTML element of this menu.
     * @returns {HTMLElement}
     */
    this.getElement = () => _element;

    make();
}

MenuStory.CLASS = "story";
