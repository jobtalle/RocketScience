import {getString} from "../../language";

const showPartInfo = (part, setInfo) => {
    if (part)
        setInfo(getString(part.label), getString(part.description));
    else
        setInfo("", "");
};

let clickedPart = null;

/**
 * A part button used to instantiate a part.
 * @param {Object} part A part from parts.json.
 * @param {Function} setPart The function to be called when a part is selected.
 * @param {Function} setInfo The function to be called when new part info is selected.
 * @constructor
 */
export function CategoryPart(part, setPart, setInfo) {
    const onClick = () => {
        clickedPart = part;

        setPart(part);
        showPartInfo(part, setInfo);
    };

    const onEnter = () => showPartInfo(part, setInfo);

    const onLeave = () => showPartInfo(clickedPart, setInfo);

    /**
     * Get the HTML element of this category.
     * @returns {HTMLElement} The HTML element of this category.
     */
    this.getElement = () => {
        const element = document.createElement("div");

        element.classList.add(CategoryPart.CLASS);
        element.classList.add("sprite");
        element.classList.add(part.icon);

        element.onclick = onClick;
        element.onmouseover = onEnter;
        element.onmouseout = onLeave;

        return element;
    };
}

CategoryPart.CLASS = "part";