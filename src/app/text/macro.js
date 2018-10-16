import {getString} from "./language";

/**
 * A macro to replace in text.
 * @param {String} find The string to replace when encountered.
 * @param {String} replaceClass The CSS class to wrap around the replacement.
 * @param {String} replaceText The text to replace the macro with.
 * @constructor
 */
export function Macro(find, replaceClass, replaceText) {
    this.find = find;

    /**
     * Get the text that the finding should be replaced with based on the current language.
     * @returns {string} The replace text.
     */
    this.getReplaceText = () => {
        return "<span class=\"" + replaceClass + "\">" + getString(replaceText) + "</span>";
    };
}