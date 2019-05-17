import "../../../../styles/userIcon.css"
import {Avatar} from "./avatar";

/**
 * The user icon, which is a portal to the user settings.
 * @param user {User} The User object
 * @param onClick {Function} The onClick action
 * @constructor
 */
export function UserIcon(user, onClick) {
    const _element = document.createElement("div");

    const make = () => {
        _element.id = UserIcon.ID;
        _element.appendChild(new Avatar(user.getAvatarSprites()).getElement());
        _element.onclick = onClick;
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement} The HTML element.
     */
    this.getElement = () => _element;

    make();
}

UserIcon.ID = "user-button";
UserIcon.ID_IMAGE = "user-image";
