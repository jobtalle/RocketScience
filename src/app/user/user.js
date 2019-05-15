import {Cookie} from "../storage/cookie";

/**
 * The user information stored locally and online.
 * @constructor
 */
export function User() {
    let _id = User.ANONYMOUS_USER;
    let _imageSource = User.IMAGE_SOURCE_ANONYMOUS;

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
     * @param userId
     */
    this.setUserId = (userId) => {
        _id = userId;

        new Cookie().setValue(Cookie.KEY_USER_ID, _id);
    };

    /**
     * Obtain the user ID.
     * @returns {number}
     */
    this.getUserId = () => {
        return _id;
    };

    /**
     * Obtain the source of the user image.
     * @returns {string} the link to the image.
     */
    this.getUserImage = () => {
        return _imageSource;
    };

    loadUserFromCookie();
}

User.ANONYMOUS_USER = -1;
User.IMAGE_SOURCE_ANONYMOUS = "https://png.pngtree.com/svg/20170829/1d9f83ab9c.svg";