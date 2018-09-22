/**
 * The name of a pinout.
 * @param {String} name The name.
 * @param {Boolean} selected A boolean which is true if this entry is currently selected.
 * @constructor
 */
export function InfoPinoutEntryName(name, selected) {
    const _element = document.createElement("div");

    const make = () => {
        const toggleSelected = () => _element.classList.toggle(InfoPinoutEntryName.CLASS_SELECTED);

        _element.className = InfoPinoutEntryName.CLASS;
        _element.innerText = name;
        _element.onmouseenter = _element.onmouseleave = toggleSelected;

        if (selected)
            toggleSelected();
    };

    /**
     * Get the HTML element of this pin name.
     * @returns {HTMLElement} The HTML element of this element.
     */
    this.getElement = () => _element;

    make();
}

InfoPinoutEntryName.CLASS = "pinout-name";
InfoPinoutEntryName.CLASS_SELECTED = "selected";