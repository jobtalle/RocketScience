import {Cookie} from "../storage/cookie";

/**
 * The user information stored locally and online.
 * @constructor
 */
export function User() {
    let _id = User.ANONIMOUS_USER;

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

    loadUserFromCookie();
}

User.ANONIMOUS_USER = -1;