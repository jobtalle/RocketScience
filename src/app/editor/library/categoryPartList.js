import {CategoryPart} from "./categoryPart";

/**
 * A list of parts.
 * @param {Object} parts The parts to place in this part list from parts.json.
 * @param {Function} setPart The function to be called when a part is selected.
 * @param {Function} setInfo The function to be called when new part info is selected.
 * @constructor
 */
export function CategoryPartList(parts, setPart, setInfo) {
    const _element = document.createElement("div");

    const make = () => {
        _element.className = CategoryPartList.CLASS;

        for (const part of parts)
            _element.appendChild(new CategoryPart(part, setPart, setInfo).getElement());
    };

    /**
     * Toggle expand or collapse state.
     */
    this.toggle = () => _element.classList.toggle(CategoryPartList.CLASS_CLOSED);

    /**
     * Get the HTML element of this part list.
     * @returns {HTMLElement} The HTML element of this part list.
     */
    this.getElement = () => _element;

    make();
}

CategoryPartList.CLASS = "part-list";
CategoryPartList.CLASS_CLOSED = "closed";