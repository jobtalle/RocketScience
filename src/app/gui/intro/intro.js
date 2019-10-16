import "../../../styles/intro.css"

/**
 * A load screen.
 * @param {HTMLElement} parent An element to put intro graphics on.
 * @constructor
 */
export function Intro(parent) {
    const _container = document.getElementById(Intro.ID);

    /**
     * Hide the intro graphics.
     */
    this.hide = () => {
        parent.removeChild(_container);
    };
}

Intro.ID = "intro";