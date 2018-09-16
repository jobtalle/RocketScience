import {Pcb} from "../../pcb/pcb";
import {OverlayPinoutsPin} from "./overlayPinoutsPin";
import * as Myr from "../../../lib/myr";
import {Pin} from "../../part/pin";

/**
 * A pinouts overlay.
 * @param {Number} x The x location on the pcb.
 * @param {Number} y The y location on the pcb.
 * @param {Object} configuration A valid part configuration.
 * @constructor
 */
export function OverlayPinouts(x, y, configuration) {
    /**
     * Get the HTML element of this overlay.
     * @returns {HTMLElement} The HTML element.
     */
    this.getElement = () => {
        const element = document.createElement("div");

        element.className = OverlayPinouts.CLASS;
        element.style.left = (x * Pcb.PIXELS_PER_POINT) + "px";
        element.style.top = (y * Pcb.PIXELS_PER_POINT) + "px";

        let index = 0;

        for (const pin of configuration.io) if (pin.type !== Pin.TYPE_STRUCTURAL)
            element.appendChild(new OverlayPinoutsPin(pin.x, pin.y, ++index, pin.y===0?new Myr.Vector(0, -1):new Myr.Vector(0, 1)).getElement());

        return element;
    };
}

OverlayPinouts.CLASS = "pinouts";