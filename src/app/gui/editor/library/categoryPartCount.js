import {CategoryPartCountSetter} from "./categoryPartCountSetter";

/**
 * A part count element showing the number of available parts within the current budget.
 * @param {Number} count The available number of parts.
 * @param {String} name The object name.
 * @param {Object} summary The part summary.
 * @constructor
 */
export function CategoryPartCount(count, name, summary) {
    const _element = document.createElement("div");

    const make = () => {
        _element.className = CategoryPartCount.CLASS;
    };

    /**
     * Set the value of this counter.
     * @param {Number} value The count, -1 for infinite, null for unset.
     */
    this.set = value => {
        if (value < 0)
            _element.innerText = CategoryPartCount.TEXT_INFINITE;
        else if (value === null)
            _element.innerText = (-summary.getPartCount(name)).toString();
        else
            _element.innerText = (value - summary.getPartCount(name)).toString();
    };

    /**
     * Get the HTML element of this part count setter.
     * @returns {HTMLElement} The HTML element of this setter.
     */
    this.getElement = () => _element;

    make();

    this.set(count);
}

CategoryPartCount.CLASS = "count";
CategoryPartCount.TEXT_INFINITE = CategoryPartCountSetter.TEXT_INFINITE;