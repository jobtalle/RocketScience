import {Pcb} from "../../pcb/pcb";
import {Terrain} from "../../world/terrain/terrain";
import {ContactListener} from "../../world/physics/contactListener";

/**
 * @param {Array} pins An array containing the pin indices.
 * @param {PartRenderer} renderer A part renderer to render state to.
 * @param {Number} x The X location on the board.
 * @param {Number} y The Y location on the board.
 * @constructor
 */
export function SensorTouch(pins, renderer, x, y) {
    let sensor = null;
    let cooldown = 0;

    const beginContact = () => {
        cooldown = SensorTouch.SIGNAL_TICK_COOLDOWN;
    };

    /**
     * Initialize the state.
     * @param {Physics} body A physics body to apply state to.
     */
    this.initialize = body => {
        sensor = body.createTouchSensor(
            (x + 0.5) * Pcb.PIXELS_PER_POINT * Terrain.METERS_PER_PIXEL,
            (y + 0.5) * Pcb.PIXELS_PER_POINT * Terrain.METERS_PER_PIXEL,
            Pcb.PIXELS_PER_POINT * Terrain.METERS_PER_PIXEL,
            -Math.PI * 0.5,
            new ContactListener(beginContact, null));
    };

    /**
     * Update the state.
     * @param {Array} state A state array to read from and/or write to.
     */
    this.tick = state => {
        if (cooldown > 0) {
            state[pins[SensorTouch.PIN_INDEX_SIGNAL]] = 1;

            --cooldown;
        } else
            state[pins[SensorTouch.PIN_INDEX_SIGNAL]] = 0;
    };
}

SensorTouch.PIN_INDEX_SIGNAL = 0;
SensorTouch.SIGNAL_TICK_COOLDOWN = 1;