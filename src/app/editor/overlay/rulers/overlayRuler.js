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
        _element.innerText = definition.length.toString();
        _element.style.width = (definition.length * Pcb.PIXELS_PER_POINT) + "px";
        _element.style.left = (definition.x * Pcb.PIXELS_PER_POINT) + "px";
        _element.style.top = (definition.y * Pcb.PIXELS_PER_POINT) + "px";

        if (definition.direction === OverlayRulerDefinition.DIRECTION_UP)
            _element.classList.add(OverlayRuler.CLASS_UP);
    };

    /**
     * Get this rulers HTML element.
     * @returns {HTMLElement} This rulers HTML element.
     */
    this.getElement = () => _element;

    make();
}

OverlayRuler.CLASS = "ruler";
OverlayRuler.CLASS_UP = "up";