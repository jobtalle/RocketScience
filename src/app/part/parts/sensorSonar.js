import {Scale} from "../../world/scale";
import Myr from "myr.js"

/**
 * @param {Array} pins An array containing the pin indices.
 * @param {PartRenderer} renderer A part renderer to render state to.
 * @param {Number} x The X location on the board.
 * @param {Number} y The Y location on the board.
 * @constructor
 */
export function SensorSonar(pins, renderer, x, y) {
    let _ray = null;
    /**
     * Initialize the state.
     * @param {Body} body A physics body to apply state to.
     */
    this.initialize = body => {
        _ray = body.createRay(
            (x + 1) * Scale.METERS_PER_POINT,
            (y + 1) * Scale.METERS_PER_POINT,
            new Myr.Vector(5, 0));
    };

    /**
     * Update the state.
     * @param {Array} state A state array to read from and/or write to.
     */
    this.tick = state => {
        if (state[pins[SensorSonar.PIN_INDEX_POWER]] === 1)
            state[pins[SensorSonar.PIN_INDEX_OUTPUT]] = 1 - _ray.getLength();
        else
            state[pins[SensorSonar.PIN_INDEX_OUTPUT]] = 0;
    };
}

SensorSonar.PIN_INDEX_POWER = 0;
SensorSonar.PIN_INDEX_OUTPUT = 1;