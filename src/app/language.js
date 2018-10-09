import english from "../assets/text/english"
import dutch from "../assets/text/dutch"

export function Language() {
    let _language;

    this.set = lang => {
        switch(lang) {
            case Language.ENGLISH:
                _language = english;
                break;
            case Language.DUTCH:
                _language = dutch;
                break;
        }
    };

    this.get = key => {
        const text = _language[key];

        if (text === undefined)
            return Language.ERROR_TEXT;

        return text;
    };

    this.set(Language.DEFAULT);
}

Language.ENGLISH = 0;
Language.DUTCH = 1;
Language.DEFAULT = Language.ENGLISH;
Language.ERROR_TEXT = "<string not found>";

const language = new Language();

/**
 * Set the current language.
 * @param {String} language Any valid language constant provided by the Language class.
 */
export function setLanguage(language) {
    language.set(language);
}

/**
 * Get a string from the text library.
 * @param {String} key The strings key.
 */
export function getString(key) {
    return language.get(key);
}
