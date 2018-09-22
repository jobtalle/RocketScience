import {Pcb} from "../../../pcb/pcb";
import {OverlayPinoutsPin} from "./overlayPinoutsPin";
import * as Myr from "../../../../lib/myr";
import {Pin} from "../../../part/pin";

/**
 * A pinouts overlay.
 * @param {Number} x The x location on the pcb.
 * @param {Number} y The y location on the pcb.
 * @param {Object} configuration A valid part configuration.
 * @param {Number} [highlightIndex] An optional pin index to highlight. Don't provide this if all pins must be shown.
 * @constructor
 */
export function OverlayPinouts(x, y, configuration, highlightIndex) {
    const _element = document.createElement("div");

    const make = () => {
        _element.className = OverlayPinouts.CLASS;
        _element.style.left = (x * Pcb.PIXELS_PER_POINT) + "px";
        _element.style.top = (y * Pcb.PIXELS_PER_POINT) + "px";

        const directions = OverlayPinouts.makeLabelDirections(configuration);
        let index = 0;

        for (const pin of configuration.io) if (pin.type !== Pin.TYPE_STRUCTURAL) {
            ++index;

            if (highlightIndex !== undefined && index !== highlightIndex + 1)
                continue;

            _element.appendChild(new OverlayPinoutsPin(pin.x, pin.y, index, pin, directions[index - 1]).getElement());
        }
    };

    /**
     * Get the HTML element of this overlay.
     * @returns {HTMLElement} The HTML element.
     */
    this.getElement = () => _element;

    make();
}

OverlayPinouts.makeLabelDirections = configuration => {
    const directions = [];
    const occupied = [];
    const pins = [];

    const EMPTY = 0;
    const OCCUPIED = 1;
    const PIN = 2;

    const getDirection = (x, y) => {
        let left = EMPTY;
        let top = EMPTY;
        let right = EMPTY;
        let bottom = EMPTY;

        for (const point of occupied) {
            if (point.x === x - 1 && point.y === y)
                left = OCCUPIED;
            else if (point.x === x && point.y === y - 1)
                top = OCCUPIED;
            else if (point.x === x + 1 && point.y === y)
                right = OCCUPIED;
            else if (point.x === x && point.y === y + 1)
                bottom = OCCUPIED;
        }

        for (const pin of pins) {
            if (pin.x === x - 1 && pin.y === y)
                left = PIN;
            else if (pin.x === x && pin.y === y - 1)
                top = PIN;
            else if (pin.x === x + 1 && pin.y === y)
                right = PIN;
            else if (pin.x === x && pin.y === y + 1)
                bottom = PIN;
        }

        if (top === EMPTY) {
            if (left === EMPTY && (top === PIN || bottom === PIN))
                return new Myr.Vector(-1, 0);

            if (right === EMPTY && (top === PIN || bottom === PIN))
                return new Myr.Vector(1, 0);

            return new Myr.Vector(0, -1);
        } else if (bottom === EMPTY) {
            if (left === EMPTY && (top === PIN || bottom === PIN))
                return new Myr.Vector(-1, 0);

            if (right === EMPTY && (top === PIN || bottom === PIN))
                return new Myr.Vector(1, 0);

            return new Myr.Vector(0, 1);
        } else if (left === EMPTY)
            return new Myr.Vector(-1, 0);
        else if (right === EMPTY)
            return new Myr.Vector(1, 0);
        else
            return new Myr.Vector(0, -1);
    };

    for (const point of configuration.footprint.points)
        occupied.push(point);

    if (configuration.footprint.air) for (const air of configuration.footprint.air)
        occupied.push(air);

    if (configuration.footprint.space) for (const space of configuration.footprint.space)
        occupied.push(space);

    for (const pin of configuration.io)
        pins.push(pin);

    for (const pin of configuration.io) if (pin.type !== Pin.TYPE_STRUCTURAL)
        directions.push(getDirection(pin.x, pin.y));

    return directions;
};

OverlayPinouts.CLASS = "pinouts";