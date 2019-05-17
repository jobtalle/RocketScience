import {Cookie} from "../storage/cookie";
import {AvatarSprites} from "./avatarSprites";

/**
 * The user information stored locally and online.
 * @constructor
 */
export function User() {
    let _id = User.ANONYMOUS_USER;
    let _avatarSprites = new AvatarSprites();

    const loadUserFromCookie = () => {
        const cookie = new Cookie();

        if (cookie.hasValue(Cookie.KEY_USER_ID))
            _id = cookie.getValue(Cookie.KEY_USER_ID);
        else {
            cookie.setValue(Cookie.KEY_USER_ID, _id);
        }
    };

    /**
     * Set the user ID of the user.
     * @param userId {int} The user ID
     */
    this.setUserId = (userId) => {
        _id = userId;

        new Cookie().setValue(Cookie.KEY_USER_ID, _id);
    };

    /**
     * Obtain the user ID.
     * @returns {number} The user ID
     */
    this.getUserId = () => _id;

    /**
     * Obtain the sprites for the avatar
     * @returns {AvatarSprites} The AvatarSprites object.
     */
    this.getAvatarSprites = () => _avatarSprites;

    loadUserFromCookie();
}

User.ANONYMOUS_USER = -1;