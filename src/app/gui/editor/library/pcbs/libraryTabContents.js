
export function LibraryTabContents() {
    const _element = document.createElement("div");
    let _contents = null;

    const make = () => {
        _element.id = LibraryTabContents.ID;
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