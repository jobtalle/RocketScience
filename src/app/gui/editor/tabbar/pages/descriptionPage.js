/**
 * A page where the description of the mission can be adjusted.
 * @param {Mission} mission The current mission.
 * @constructor
 */
export function DescriptionPage(mission) {
    const _element = document.createElement("div");

    const makeField = () => {
        const element = document.createElement("input");

        element.value = mission.getDescription();
        element.onkeydown = element.onkeyup = event => event.stopPropagation();
        element.oninput = () => {
            mission.setDescription(element.value);
        };

        return element;
    };

    const build = () => {
        _element.classList.add(DescriptionPage.CLASS);
        _element.style.backgroundColor = DescriptionPage.BACKGROUND_COLOR;

        _element.appendChild(makeField());
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