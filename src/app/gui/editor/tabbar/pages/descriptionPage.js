import {makeInputField} from "../../../../utils/makeInputField";
import {getString} from "../../../../text/language";

/**
 * A page where the description of the mission can be adjusted.
 * @param {Mission} mission The current mission.
 * @constructor
 */
export function DescriptionPage(mission) {
    const _element = document.createElement("div");

    const build = () => {
        _element.classList.add(DescriptionPage.CLASS);
        _element.style.backgroundColor = DescriptionPage.BACKGROUND_COLOR;

        _element.appendChild(makeInputField(mission.getDescription(), value => {
            mission.setDescription(value);
            return value;
        }, getString(DescriptionPage.DESCRIPTION_LABEL), DescriptionPage.DESCRIPTION_INPUT_SIZE));
    };

    build();

    /**
     * Get the element of this page.
     * @returns {HTMLDivElement}
     */
    this.getElement = () => _element;
}

DescriptionPage.CLASS = "page";
DescriptionPage.BACKGROUND_COLOR = "#37946e";
DescriptionPage.DESCRIPTION_LABEL = "TABPAGE_DESCRIPTION_LABEL";
DescriptionPage.DESCRIPTION_INPUT_SIZE = 40;
