import {Pcb} from "../../../../../pcb/pcb";
import {InfoPinouts} from "../../info/pinouts/infoPinouts";
import {ColorUtils} from "../../../../../utils/colorUtils";
import * as Myr from "../../../../../../lib/myr";
import {Pin} from "../../../../../part/pin";

/**
 * A pin number pointing towards the pin.
 * @param {Number} x The x position on the pcb.
 * @param {Number} y The y position on the pcb.
 * @param {Number} index The pin index to display.
 * @param {Object} pin The pin object.
 * @param {Myr.Vector} offset The offset in which the label is shifted. Must have a length of 1 and not be diagonal.
 * @constructor
 */
export function OverlayPinoutsPin(x, y, index, pin, offset) {
    const _element = document.createElement("div");

    const make = () => {
        const color = Pin.getPinColor(pin).copy();

        color.a = OverlayPinoutsPin.ALPHA;

        _element.className = OverlayPinoutsPin.CLASS;
        _element.style.left = ((x + offset.x * 1.5) * Pcb.PIXELS_PER_POINT) + "px";
        _element.style.top = ((y + offset.y * 1.5) * Pcb.PIXELS_PER_POINT) + "px";
        _element.style.backgroundColor = ColorUtils.toCss(color);
        _element.innerText = InfoPinouts.formatIndex(index);

        _element.appendChild(OverlayPinoutsPin.makeArrow(offset, color));
    };

    /**
     * Get this pin labels element.
     * @returns {HTMLElement} The HTML element of this label.
     */
    this.getElement = () => _element;

    make();
}

OverlayPinoutsPin.makeArrow = (vector, color) => {
    const element = document.createElement("div");
    const borderSide = (Pcb.PIXELS_PER_POINT * 0.5) + "px solid transparent";
    const borderFrom = Pcb.PIXELS_PER_POINT + "px solid " + ColorUtils.toCss(color);

    element.className = OverlayPinoutsPin.CLASS_ARROW;
    element.style.width = "0";
    element.style.height = "0";

    if (vector.x === 0) {
        element.style.borderLeft = element.style.borderRight = borderSide;

        if (vector.y === -1)
            element.style.borderTop = borderFrom;
        else {
            element.style.borderBottom = borderFrom;
            element.style.bottom = Pcb.PIXELS_PER_POINT + "px";
        }
    }
    else {
        element.style.borderTop = element.style.borderBottom = borderSide;
        element.style.top = "0";

        if (vector.x === -1) {
            element.style.borderLeft = borderFrom;
            element.style.left = Pcb.PIXELS_PER_POINT + "px";
        } else {
            element.style.borderRight = borderFrom;
            element.style.right = Pcb.PIXELS_PER_POINT + "px";
        }
    }

    return element;
};

OverlayPinoutsPin.CLASS = "pin";
OverlayPinoutsPin.CLASS_ARROW = "arrow";
OverlayPinoutsPin.ALPHA = 0.6;