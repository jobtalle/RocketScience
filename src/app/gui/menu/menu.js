import "../../../styles/menu.css"
import {MenuTitle} from "./title";
import {MenuRoot} from "./root/menuRoot";
import {UserIcon} from "./user/userIcon";
import {User} from "../../user/user";

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
        const removed = [];

        if (_divContent.firstChild) {
            removed.push(_contentObject);

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
        _divWrapper.appendChild(new UserIcon(user, null).getElement());
        _divWrapper.appendChild(_divContent);
    };

    const reloadCurrentContent = () => {
        if (!_contentObject)
            return;

        _contentObject.reload();
        _divContent.removeChild(_divContent.firstChild);
        _divContent.appendChild(_contentObject.getElement());
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
     * @param {Object} content An object that can at least create an element and reload.
     */
    this.setContent = content => {
        _contentStack.push(clearContent());

        _contentObject = content;
        _divContent.appendChild(_contentObject.getElement());
    };

    /**
     * Set the content to the previous configuration if there is one.
     */
    this.goBack = () => {
        const newContent = _contentStack.pop();

        if (newContent) {
            clearContent();

            for (const content of newContent) {
                _contentObject = content;
                _contentObject.reload();
                _divContent.appendChild(_contentObject.getElement());
            }
        }
    };

    /**
     * Show the menu.
     */
    this.show = () => {
        reloadCurrentContent();
        parent.appendChild(_divWrapper);
    };

    /**
     * Hide the menu.
     */
    this.hide = () => {
        parent.removeChild(_divWrapper);
    };

    build();

    _contentObject = new MenuRoot(this, user);
    _divContent.appendChild(_contentObject.getElement());
}

Menu.ID_WRAPPER = "menu";
Menu.CLASS_TITLE = "title";
Menu.CLASS_CONTENT = "content";