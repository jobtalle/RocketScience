
export function LibraryTabButton(onClick, tooltip, spriteClass) {
    const _element = document.createElement("div");

    const make = () => {
        _element.classList.add(LibraryTabButton.CLASS, "sprite", spriteClass);

        _element.onclick = () => onClick();

        _element.title = tooltip;
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement}
     */
    this.getElement = () => _element;

    make();
}

LibraryTabButton.CLASS = "button";