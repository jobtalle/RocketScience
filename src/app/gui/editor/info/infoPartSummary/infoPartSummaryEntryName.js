export function InfoPartSummaryEntryName(name) {
    const _element = document.createElement("div");

    const make = () => {
        _element.className = InfoPartSummaryEntryName.CLASS;
        _element.innerHTML = name;
    };

    /**
     * Get the HTML element of this part list.
     * @returns {HTMLElement} The HTML element of this part list.
     */
    this.getElement = () => _element;

    make();
}

InfoPartSummaryEntryName.CLASS = "name";