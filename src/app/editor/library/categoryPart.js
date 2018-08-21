import {getString} from "../../language";

/**
 * A part button used to instantiate a part.
 * @param {Object} part A part from parts.json.
 * @param {Function} setPart The function to be called when a part is selected.
 * @param {Function} setInfo The function to be called when new part info is selected.
 * @constructor
 */
export function CategoryPart(part, setPart, setInfo) {
    const onClick = () => {
        setPart(part);
        setInfo(getString(part.label), getString(part.description));
    };

    /**
     * Get the HTML element of this category.
     * @returns {HTMLElement} The HTML element of this category.
     */
    this.getElement = () => {
        const element = document.createElement("div");

        element.classList.add(CategoryPart.CLASS);
        element.classList.add("sprite");
        element.classList.add(part.icon);

        element.onclick = () => onClick();

        return element;
    };
}

CategoryPart.CLASS = "part";