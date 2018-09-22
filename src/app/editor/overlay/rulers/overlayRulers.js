import {OverlayRuler} from "./overlayRuler";

/**
 * A set of rulers.
 * @param {Array} rulers An array of ruler definitions.
 * @constructor
 */

export function OverlayRulers(rulers) {
    const _element = document.createElement("div");

    const make = () => {
        _element.className = OverlayRulers.CLASS;

        for (const definition of rulers)
            _element.appendChild(new OverlayRuler(definition).getElement());
    };

    /**
     * Get the HTML element containing the rulers.
     * @returns {HTMLElement} The HTML element containing the rulers.
     */
    this.getElement = () => _element;

    make();
}

OverlayRulers.CLASS = "rulers";