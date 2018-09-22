import {OverlayRulerDefinition} from "./overlayRulerDefinition";
import {Pcb} from "../../../pcb/pcb";

/**
 * A ruler.
 * @param {OverlayRulerDefinition} definition A ruler definition.
 * @constructor
 */
export function OverlayRuler(definition) {
    const _element = document.createElement("div");

    const make = () => {
        _element.className = OverlayRuler.CLASS;
        _element.style.width = (definition.length * Pcb.PIXELS_PER_POINT) + "px";
        _element.style.left = (definition.x * Pcb.PIXELS_PER_POINT) + "px";
        _element.style.top = (definition.y * Pcb.PIXELS_PER_POINT) + "px";

        if (definition.direction === OverlayRulerDefinition.DIRECTION_UP)
            _element.classList.add(OverlayRuler.CLASS_UP);

        _element.appendChild(OverlayRuler.makeLeft());
        _element.appendChild(OverlayRuler.makeText(definition.length.toString()));
        _element.appendChild(OverlayRuler.makeRight());
    };

    /**
     * Get this rulers HTML element.
     * @returns {HTMLElement} This rulers HTML element.
     */
    this.getElement = () => _element;

    make();
}

OverlayRuler.makeHBar = () => {
    const element = document.createElement("div");

    element.className = OverlayRuler.CLASS_HBAR;

    return element;
};

OverlayRuler.makeVBar = () => {
    const element = document.createElement("div");

    element.className = OverlayRuler.CLASS_VBAR;

    return element;
};

OverlayRuler.makeLeft = () => {
    const element = document.createElement("div");

    element.className = OverlayRuler.CLASS_PADDING;
    element.appendChild(OverlayRuler.makeVBar());
    element.appendChild(OverlayRuler.makeHBar());

    return element;
};

OverlayRuler.makeText = text => {
    const element = document.createElement("div");

    element.className = OverlayRuler.CLASS_TEXT;
    element.innerText = text;

    return element;
};

OverlayRuler.makeRight = () => {
    const element = document.createElement("div");

    element.className = OverlayRuler.CLASS_PADDING;
    element.appendChild(OverlayRuler.makeHBar());
    element.appendChild(OverlayRuler.makeVBar());

    return element;
};

OverlayRuler.CLASS = "ruler";
OverlayRuler.CLASS_UP = "up";
OverlayRuler.CLASS_PADDING = "padding";
OverlayRuler.CLASS_TEXT = "text";
OverlayRuler.CLASS_VBAR = "vbar";
OverlayRuler.CLASS_HBAR = "hbar";