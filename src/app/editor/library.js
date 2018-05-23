import "../../styles/library.css"

/**
 * An HTML based parts library.
 * @param {Object} editor A PcbEditor which places selected objects.
 * @param {Object} overlay An overlay element for HTML GUI.
 * @param {Number} width The width of the library in pixels.
 * @constructor
 */
export function Library(editor, overlay, width) {
    const ID_LIBRARY = "library";

    let _container = null;

    const build = () => {
        if(_container)
            overlay.removeChild(_container);

        _container = document.createElement("div");
        _container.id = ID_LIBRARY;
        _container.style.width = width + "px";

        overlay.appendChild(_container);
    };

    /**
     * Gets the width of the library.
     * @returns {Number} The width in pixels.
     */
    this.getWidth = () => width;

    build();
}