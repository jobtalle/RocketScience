/**
 * A big centered menu input button.
 * @param {String} title A title for the button.
 * @param {Function} onClick A function to execute when the button is clicked.
 * @constructor
 */

export function InputButtonCentered(title, onClick) {
    const _element = document.createElement("div");

    const getButton = () => {
        const inputElement = document.createElement("input");
        inputElement.type = "file";
        inputElement.onchange = event => {
            const file = event.target.files[0];
            onClick(file);
        };
        inputElement.innerHTML = title;
        inputElement.accept = "application/octet-stream";

        return inputElement;
    };

    const make = () => {
        _element.className = InputButtonCentered.CLASS;
        _element.appendChild(getButton());
    };

    /**
     * Get this buttons HTML element.
     * @returns {HTMLElement} An HTML element.
     */
    this.getElement = () => _element;

    make();
}

InputButtonCentered.CLASS = "button-centered";