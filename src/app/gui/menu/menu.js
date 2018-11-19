import "../../../styles/menu.css"
import {MenuTitle} from "./title";
import {MenuRoot} from "./root/menuRoot";

/**
 * The menu object creates an HTML menu which changes Game state.
 * @param {Game} game A constructed Game object to be controlled.
 * @param {HTMLElement} parent An HTML element to create the menu on.
 * @constructor
 */
export function Menu(game, parent) {
    const _divWrapper = document.createElement("div");
    const _divTitle = document.createElement("div");
    const _divContent = document.createElement("div");
    const _contentStack = [];

    const clearContent = () => {
        const removed = [];

        while (_divContent.firstChild) {
            removed.push(_divContent.firstChild);

            _divContent.removeChild(_divContent.firstChild);
        }

        return removed;
    };

    const build = () => {
        _divWrapper.id = Menu.ID_WRAPPER;

        _divTitle.className = Menu.CLASS_TITLE;
        _divContent.className = Menu.CLASS_CONTENT;

        _divTitle.appendChild(new MenuTitle().getElement());

        _divWrapper.appendChild(_divTitle);
        _divWrapper.appendChild(_divContent);
    };

    /**
     * Get the Game object.
     * @returns {Game} The Game object.
     */
    this.getGame = () => {
        return game;
    };

    /**
     * Set the content of this menu.
     * @param {HTMLElement} element An HTML element to place in the menu content.
     */
    this.setContent = element => {
        _contentStack.push(clearContent());

        _divContent.appendChild(element);
    };

    /**
     * Set the content to the previous configuration if there is one.
     */
    this.goBack = () => {
        const newContent = _contentStack.pop();

        if (newContent) {
            clearContent();

            for (const element of newContent)
                _divContent.appendChild(element);
        }
    };

    /**
     * Show the menu.
     */
    this.show = () => {
        parent.appendChild(_divWrapper);
    };

    /**
     * Hide the menu.
     */
    this.hide = () => {
        parent.removeChild(_divWrapper);
    };

    build();

    _divContent.appendChild(new MenuRoot(this).getElement());
}

Menu.ID_WRAPPER = "menu";
Menu.CLASS_TITLE = "title";
Menu.CLASS_CONTENT = "content";