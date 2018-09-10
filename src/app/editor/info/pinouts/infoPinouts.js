/**
 * A list of pinouts.
 * @param {Object} configuration A valid part configuration to read pins from.
 * @constructor
 */
export function InfoPinouts(configuration) {
    /**
     * Get the HTML element of this pinout information.
     * @returns {HTMLElement} The HTML element of this list.
     */
    this.getElement = () => {
        const element = document.createElement("div");

        element.className = InfoPinouts.CLASS;

        return element;
    };
}

InfoPinouts.CLASS = "pinouts";