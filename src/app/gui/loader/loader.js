import "../../../styles/loader.css"

/**
 * A load screen.
 * @param {HTMLElement} parent An element to put loader graphics on.
 * @constructor
 */
export function Loader(parent) {
    const _container = document.createElement("div");

    const make = () => {
        _container.id = Loader.ID;

        parent.appendChild(_container);
    };

    /**
     * Hide the loader graphics.
     */
    this.hide = () => {
        parent.removeChild(_container);
    };

    make();
}

Loader.ID = "loader";