import {MenuStory} from "./menuStory";

/**
 * A collection of separate stories.
 * @param {Menu} menu A menu.
 * @param {User} user The user of the system.
 * @constructor
 */
export function MenuStories(menu, user) {
    const _element = document.createElement("div");

    const clearMission = (mission, story, element) => {
        user.clearMission(mission);

        user.loadStory(story.getStory(),
            (result) => {
                _element.insertBefore(new MenuStory(result, menu, user, clearMission).getElement(), element);
                _element.removeChild(element);
            },
            (error) => {
                console.log(error);
            });
    };

    const make = () => {
        const _stories = [];

        _element.className = MenuStories.CLASS;

        // Fill with dummy children
        for (let index = 0; index < user.getStoryCount(); ++index) {
            const emptyElement = document.createElement("div");

            _stories.push(emptyElement);
            _element.appendChild(emptyElement);
        }

        user.loadStories(
            (result, index) => {
                _element.insertBefore(new MenuStory(result, menu, user, clearMission).getElement(), _stories[index]);

                _element.removeChild(_stories[index]);
            },
            () => {
                // TODO: do something onComplete
            },
            (error) => {
                // TODO: show error
                console.log(error);
        });
    };

    /**
     * Get the HTML element of this menu.
     * @returns {HTMLElement}
     */
    this.getElement = () => _element;

    make();
}

MenuStories.CLASS = "stories";
