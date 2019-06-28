
export function LibraryTabContents() {
    const _element = document.createElement("div");
    let _contents = null;

    const scroll = delta => {
        _element.scrollTop += delta;
    };

    const make = () => {
        _element.id = LibraryTabContents.ID;

        _element.addEventListener("wheel", event => {
            if (event.deltaY < 0)
                scroll(-LibraryTabContents.SCROLL_SPEED);
            else
                scroll(LibraryTabContents.SCROLL_SPEED);
        });

    };

    /**
     * Set the contents of the Library tab
     * @param {HTMLElement} content A HTML element.
     */
    this.setContents = (content) => {
        if (_contents)
            _element.replaceChild(content, _contents);
        else
            _element.appendChild(content);
        _contents = content;
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement}
     */
    this.getElement = () => _element;

    make();
}

LibraryTabContents.ID = "contents";
LibraryTabContents.SCROLL_SPEED = 35;