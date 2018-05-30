import "../../styles/library.css"

/**
 * An HTML based parts library.
 * @param {Object} editor A PcbEditor which places selected objects.
 * @param {Object} overlay An overlay element for HTML GUI.
 * @param {Number} width The width of the library in pixels.
 * @constructor
 */
export function Library(editor, overlay, width) {
    const ID_LIBRARY = "library",
          CLASS_CATEGORY_TITLE = "title",
          CLASS_CATEGORY_PART_LIST = "part-list",
          CLASS_PART = "part",
          CLASS_DESCRIPTION = "description",
          CLASS_SELECTED = "selected",
          CLASS_CLOSED = "closed";

    let _parts = require('../../assets/parts.json');
    let _container = null;

    const buildPart = (category, part) => {
        const partElement = document.createElement("div");
        partElement.className = CLASS_PART;
        partElement.onclick = () => {
            console.log("Selected: " + part);

            const selected = document.getElementsByClassName(CLASS_SELECTED)[0];
            if (selected)
                selected.classList.remove(CLASS_SELECTED);
            partElement.classList.add(CLASS_SELECTED);
        };

        let labelElement = document.createElement("div");
        labelElement.innerText = _parts[category][part].label;
        partElement.appendChild(labelElement);

        let descriptionElement = document.createElement("div");
        descriptionElement.innerText = _parts[category][part].description;
        descriptionElement.className = CLASS_DESCRIPTION;
        partElement.appendChild(descriptionElement);

        return partElement;
    };

    const buildCategory = (category) => {
        const categoryContainer = document.createElement("div");
        categoryContainer.id = category;

        const titleElement = document.createElement("div");
        titleElement.className = CLASS_CATEGORY_TITLE;
        titleElement.textContent = category;
        titleElement.onclick = () => partListElement.classList.toggle(CLASS_CLOSED);

        categoryContainer.appendChild(titleElement);

        const partListElement = document.createElement("div");
        partListElement.className = CLASS_CATEGORY_PART_LIST;

        for (const part in _parts[category])
            if (_parts[category].hasOwnProperty(part))
                partListElement.appendChild(buildPart(category, part));

        categoryContainer.appendChild(partListElement);

        return categoryContainer;
    };

    const build = () => {
        if(_container)
            overlay.removeChild(_container);

        _container = document.createElement("div");
        _container.id = ID_LIBRARY;
        _container.style.width = width + "px";

        for (const category in _parts)
            if (_parts.hasOwnProperty(category))
                _container.appendChild(buildCategory(category));
    };

    /**
     * Gets the width of the library.
     * @returns {Number} The width in pixels.
     */
    this.getWidth = () => width;

    /**
     * Hide the library. This does not delete the library.
     * It can be shown again later using show().
     */
    this.hide = () => {
        overlay.removeChild(_container);
    };

    /**
     * Show the library.
     */
    this.show = () => {
        overlay.appendChild(_container);
    };

    build();
}