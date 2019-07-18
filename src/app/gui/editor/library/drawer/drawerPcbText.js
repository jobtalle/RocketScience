
export function DrawerPcbText(text) {
    const _element = document.createElement("div");

    const make = () => {
        _element.classList.add(DrawerPcbText.CLASS);
        _element.innerText = text;
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement} The HTML element.
     */
    this.getElement = () => _element;

    make();
}

DrawerPcbText.CLASS = "pcb-title";