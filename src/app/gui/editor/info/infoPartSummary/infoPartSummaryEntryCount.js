export function InfoPartSummaryEntryCount(count) {
    const _element = document.createElement("div");

    const make = () => {
        _element.className = InfoPartSummaryEntryCount.CLASS;

        _element.innerHTML = count + "×";
    };

    /**
     * Get the HTML element of this part list.
     * @returns {HTMLElement} The HTML element of this part list.
     */
    this.getElement = () => _element;

    make();
}

InfoPartSummaryEntryCount.CLASS = "count";