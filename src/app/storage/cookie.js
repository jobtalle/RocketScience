/**
 * The cookie for the system. Holds a dictionary with values.
 * @constructor
 */
export function Cookie() {
    const cookieKey = Cookie.COOKIE_KEY_NAME;
    let cookieValue = {};

    const createExpireDate = (hours=0, days=0, months=0, years=0) => {
        let date = new Date();
        date.setTime(date.getTime() + years*60*60*24*365 + months*60*60*24*30 + days*60*60*24 + hours*60*60);
        return ";expires=" + date.toDateString();
    };

    const createPath = (path="/") => {
        return ";path=" + path;
    };

    const createNewCookie = () => {
        storeCookie(10);
    };

    const storeCookie = (expireYears) => {
        document.cookie = (cookieKey + "=" + JSON.stringify(cookieValue) +
            createExpireDate(0, 0, 0, expireYears) +
            createPath());
    };

    const doesCookieExist = () => {
        // noinspection RedundantIfStatementJS
        if (document.cookie.split(';').filter(
            (item) => item.trim().startsWith(Cookie.COOKIE_KEY_NAME+'=')).length) {
            return true;
        }

        return false;
    };

    const getCookieValue = () => {
        const keyName = Cookie.COOKIE_KEY_NAME + "=";
        let decodedCookie = decodeURIComponent(document.cookie).split(';');

        for (let index = 0; index < decodedCookie.length; ++index) {
            let char = decodedCookie[index];

            while (char.charAt(0) === ' ')
                char = char.substring(1, char.length);

            if (char.indexOf(keyName) === 0)
                return JSON.parse(char.substring(keyName.length, char.length));
        }

        return {};
    };

    /**
     * Sets the value to the dictionary and saves it to the cookie.
     * @param {String} key The key of the data in the dictionary.
     * @param {String} value The value that should be assigned to the key.
     */
    this.setValue = (key, value) => {
        cookieValue[key] = value;

        storeCookie(10);
    };

    /**
     * Get the value from the cookie dictionary, if it exists.
     * @param {String} key The key of the data in the dictionary.
     * @returns {String|Null} Either the value or null if there is no value stored.
     */
    this.getValue = (key) => {
        if (cookieValue[key])
            return cookieValue[key];
        else
            return null;
    };

    /**
     * Check if the key has a value in the dictionary.
     * @param {String} key The key of the data in the dictionary.
     * @returns {Boolean} True if there is a value stored, False if there is no value stored.
     */
    this.hasValue = (key) => {
        return cookieValue[key]
    };

    if (doesCookieExist())
        cookieValue = getCookieValue();
    else
        createNewCookie();
}

Cookie.COOKIE_KEY_NAME = "rocketscience";

Cookie.KEY_USER_ID = "userId";