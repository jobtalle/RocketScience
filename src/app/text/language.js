import "../../styles/text.css";
import {Macro} from "./macro";
import {requestText} from "../utils/requestText";

function Language() {
    let _language;

    const applyMacros = () => {
        const expressions = [];

        for (const macro of Language.MACROS)
            expressions.push(new RegExp(macro.find, "g"));

        for (const key of Object.keys(_language)) {
            let applied = _language[key];
            let raw = _language[key];

            for (let i = 0; i < Language.MACROS.length; ++i) {
                applied = applied.replace(expressions[i], Language.MACROS[i].getReplaceText());
                raw = raw.replace(expressions[i], Language.MACROS[i].getReplaceTextRaw());
            }

            _language[key] = applied;
            _language[Language.PREFIX_RAW + key] = raw;
        }
    };

    this.set = (source, modEntries, onReady, onError) => {
        requestText(source, file => {
            _language = JSON.parse(file);

            for (const key in modEntries) if (!_language.hasOwnProperty(key))
                _language[key] = modEntries[key];

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

    this.getRaw = key => {
        const text = _language[Language.PREFIX_RAW + key];

        if (text === undefined)
            return Language.ERROR_TEXT;

        return text;
    };
}

Language.PREFIX_RAW = "_raw_";
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
 * @param {Object} modEntries A JSON of extra language entries provided by the mods.
 * @param {Function} onReady A function to execute when the language file has been loaded.
 * @param {Function} onError A function te execute when loading failed.
 */
export function setLanguage(language, modEntries, onReady, onError) {
    _language.set(language, modEntries, onReady, onError);
}

/**
 * Get a string from the text library.
 * @param {String} key The strings key.
 */
export function getString(key) {
    return _language.get(key);
}

/**
 * Get an unformatted string from the text library.
 * @param {String} key The strings key.
 */
export function getStringRaw(key) {
    return _language.getRaw(key);
}