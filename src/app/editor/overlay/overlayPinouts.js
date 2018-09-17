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

        const directions = OverlayPinouts.makeLabelDirections(configuration);
        let index = 0;

        for (const pin of configuration.io) if (pin.type !== Pin.TYPE_STRUCTURAL)
            element.appendChild(new OverlayPinoutsPin(pin.x, pin.y, ++index, pin, directions[index - 1]).getElement());

        return element;
    };
}

OverlayPinouts.makeLabelDirections = configuration => {
    const directions = [];
    const occupied = [];
    const isFree = (x, y) => {
        for (const point of occupied)
            if (point.x === x && point.y === y)
                return false;

        return true;
    };

    for (const point of configuration.footprint.points)
        occupied.push(point);

    if (configuration.footprint.air) for (const air of configuration.footprint.air)
        occupied.push(air);

    if (configuration.footprint.space) for (const space of configuration.footprint.space)
        occupied.push(space);

    for (const pin of configuration.io) if (pin.type !== Pin.TYPE_STRUCTURAL) {
        if (isFree(pin.x, pin.y - 1))
            directions.push(new Myr.Vector(0, -1));
        else if (isFree(pin.x, pin.y + 1))
            directions.push(new Myr.Vector(0, 1));
        else if (isFree(pin.x - 1, pin.y))
            directions.push(new Myr.Vector(-1, 0));
        else if (isFree(pin.x + 1, pin.y))
            directions.push(new Myr.Vector(1, 0));
        else
            directions.push(new Myr.Vector(0, -1));
    }

    return directions;
};

OverlayPinouts.CLASS = "pinouts";