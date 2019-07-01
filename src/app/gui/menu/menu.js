import "../../../styles/menu.css"
import {MenuTitle} from "./title";
import {MenuRoot} from "./root/menuRoot";
import {UserIcon} from "./user/userIcon";
import {User} from "../../user/user";
import {MenuStories} from "./missions/menuStories";

/**
 * The menu object creates an HTML menu which changes Game state.
 * @param {Game} game A constructed Game object to be controlled.
 * @param {HTMLElement} parent An HTML element to create the menu on.
 * @param {User} user The user of the system.
 * @constructor
 */
export function Menu(game, parent, user) {
    const _divWrapper = document.createElement("div");
    const _divTitle = document.createElement("div");
    const _divContent = document.createElement("div");
    let _contentObject = null;
    const _contentStack = [];

    const clearContent = () => {
        while (_divContent.firstChild)
            _divContent.removeChild(_divContent.firstChild);

        return _contentObject;
    };

    const build = () => {
        _divWrapper.id = Menu.ID_WRAPPER;

        _divTitle.className = Menu.CLASS_TITLE;
        _divContent.className = Menu.CLASS_CONTENT;

        _divTitle.appendChild(new MenuTitle().getElement());

        _divWrapper.appendChild(_divTitle);
        _divWrapper.appendChild(new UserIcon(user, null).getElement());
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
     * @param {Function} content An object that can at least create an element and reload.
     */
    this.setContent = content => {
        _contentStack.push(clearContent());

        _contentObject = content;
        _divContent.appendChild(new _contentObject(this, user).getElement());
    };

    /**
     * Set the content to the previous configuration if there is one.
     */
    this.goBack = () => {
        _contentObject = _contentStack.pop();

        if (_contentObject) {
            clearContent();

            _divContent.appendChild(new _contentObject(this, user).getElement());
        }
    };

    /**
     * Show the menu.
     */
    this.show = () => {
        if (_contentObject) {
            clearContent();
            _divContent.appendChild(new _contentObject(this, user).getElement());
        }

        parent.appendChild(_divWrapper);
    };

    /**
     * Hide the menu.
     */
    this.hide = () => {
        parent.removeChild(_divWrapper);
    };

    build();

    _contentObject = MenuStories;
    _divContent.appendChild(new _contentObject(this, user).getElement());
}

Menu.ID_WRAPPER = "menu";
Menu.CLASS_TITLE = "title";
Menu.CLASS_CONTENT = "content";