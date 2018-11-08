import "../../styles/text.css";
import {Macro} from "./macro";
import {request} from "../utils/request";

function Language() {
    let _language;

    const applyMacros = () => {
        const expressions = [];

        for (const macro of Language.MACROS)
            expressions.push(new RegExp(macro.find, "g"));

        for (const key of Object.keys(_language)) for (let i = 0; i < Language.MACROS.length; ++i)
            _language[key] = _language[key].replace(expressions[i], Language.MACROS[i].getReplaceText());
    };

    this.set = (source, onReady, onError) => {
        request(source, file => {
            _language = JSON.parse(file);

            applyMacros();

            onReady();
        }, onError);
    };

    this.get = key => {
        const text = _language[key];

        if (text === undefined)
            return Language.ERROR_TEXT;

        return text;
    };
}

Language.ERROR_TEXT = "<string not found>";
Language.MACROS = [
    new Macro("<high>", "signal high", "MACRO_HIGH"),
    new Macro("<low>", "signal low", "MACRO_LOW")
];

const _language = new Language();

/**
 * All available languages.
 */
export const Languages = {
    ENGLISH: "english.json",
    DUTCH: "dutch.json"
};

/**
 * Set the current language.
 * @param {String} language Any valid language constant provided by the Language class.
 * @param {Function} onReady A function to execute when the language file has been loaded.
 * @param {Function} onError A function te execute when loading failed.
 */
export function setLanguage(language, onReady, onError) {
    _language.set(language, onReady, onError);
}

/**
 * Get a string from the text library.
 * @param {String} key The strings key.
 */
export function getString(key) {
    return _language.get(key);
}
