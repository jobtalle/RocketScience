import english from "../../assets/text/english";
import dutch from "../../assets/text/dutch";
import "../../styles/text.css";
import {Macro} from "./macro";

const parsedLanguages = [];

function Language() {
    let _language;

    const applyMacros = () => {
        for (const key of Object.keys(_language)) for (const macro of Language.MACROS)
            _language[key] = _language[key].replace(macro.find, macro.getReplaceText());
    };

    this.set = lang => {
        switch(lang) {
            case Language.ENGLISH:
                _language = english;

                break;
            case Language.DUTCH:
                _language = dutch;

                break;
        }

        if (!parsedLanguages.includes(lang)) {
            parsedLanguages.push(lang);

            applyMacros();
        }
    };

    this.get = key => {
        const text = _language[key];

        if (text === undefined)
            return Language.ERROR_TEXT;

        return text;
    };
}

Language.ENGLISH = 0;
Language.DUTCH = 1;
Language.DEFAULT = Language.ENGLISH;
Language.ERROR_TEXT = "<string not found>";
Language.MACROS = [
    new Macro("<high>", "signal high", "MACRO_HIGH"),
    new Macro("<low>", "signal low", "MACRO_LOW")
];

const language = new Language();

language.set(Language.DEFAULT);

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
