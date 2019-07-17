import "../../../styles/loader.css"

/**
 * A load screen.
 * @param {HTMLElement} parent An element to put loader graphics on.
 * @constructor
 */
export function Intro(parent) {
    const _container = document.createElement("div");

    const make = () => {
        _container.id = Intro.ID;

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

Intro.ID = "loader";