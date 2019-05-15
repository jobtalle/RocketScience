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
        if (value < 0) {
            _element.innerText = CategoryPartCount.TEXT_INFINITE;
            _element.classList.remove(CategoryPartCount.CLASS_NEGATIVE);
        }
        else {
            const count = value === null ? -summary.getPartCount(name) : value - summary.getPartCount(name);

            if (count < 0)
                _element.classList.add(CategoryPartCount.CLASS_NEGATIVE);
            else
                _element.classList.remove(CategoryPartCount.CLASS_NEGATIVE);

            _element.innerText = count.toString();
        }
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
CategoryPartCount.CLASS_NEGATIVE = "negative";
CategoryPartCount.TEXT_INFINITE = CategoryPartCountSetter.TEXT_INFINITE;