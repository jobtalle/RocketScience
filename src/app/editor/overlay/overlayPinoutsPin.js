import {Pcb} from "../../pcb/pcb";
import {InfoPinouts} from "../info/pinouts/infoPinouts";
import {Utils} from "../../utils/utils";
import * as Myr from "../../../lib/myr";

/**
 * A pin number pointing towards the pin.
 * @param {Number} x The x position on the pcb.
 * @param {Number} y The y position on the pcb.
 * @param {Number} index The pin index to display.
 * @param {Myr.Vector} offset The offset in which the label is shifted. Must have a length of 1 and not be diagonal.
 * @constructor
 */
export function OverlayPinoutsPin(x, y, index, offset) {
    this.getElement = () => {
        const element = document.createElement("div");

        element.className = OverlayPinoutsPin.CLASS;
        element.style.left = ((x + offset.x * 1.5) * Pcb.PIXELS_PER_POINT) + "px";
        element.style.top = ((y + offset.y * 1.5) * Pcb.PIXELS_PER_POINT) + "px";
        element.innerText = InfoPinouts.formatIndex(index);

        element.appendChild(OverlayPinoutsPin.makeArrow(offset, new Myr.Color(1, 1, 1, 0.4)));

        return element;
    };
}

OverlayPinoutsPin.makeArrow = (vector, color) => {
    const element = document.createElement("div");
    const borderSide = (Pcb.PIXELS_PER_POINT * 0.5) + "px solid transparent";
    const borderFrom = Pcb.PIXELS_PER_POINT + "px solid " + Utils.colorToCss(color);

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