/**
 * The name of a pinout.
 * @param {String} name The name.
 * @param {Boolean} selected A boolean which is true if this entry is currently selected.
 * @constructor
 */
export function InfoPinoutEntryName(name, selected) {
    /**
     * Get the HTML element of this pin name.
     * @returns {HTMLElement} The HTML element of this element.
     */
    this.getElement = () => {
        const element = document.createElement("div");
        const toggleSelected = () => element.classList.toggle(InfoPinoutEntryName.CLASS_SELECTED);

        element.className = InfoPinoutEntryName.CLASS;
        element.innerText = name;
        element.onmouseenter = element.onmouseleave = toggleSelected;

        if (selected)
            toggleSelected();

        return element;
    };
}

InfoPinoutEntryName.CLASS = "pinout-name";
InfoPinoutEntryName.CLASS_SELECTED = "selected";