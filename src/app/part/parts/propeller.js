import {Pcb} from "../../pcb/pcb";
import {Terrain} from "../../world/terrain/terrain";
import * as Myr from "../../../lib/myr";

/**
 * @param {Array} pins An array containing the pin indices.
 * @param {PartRenderer} renderer A part renderer to render state to.
 * @param {Number} x The X location on the board.
 * @param {Number} y The Y location on the board.
 * @constructor
 */
export function Propeller(pins, renderer, x, y) {
    let mover = null;
    let moving = false;

    /**
     * Initialize the state.
     * @param {Object} body A physics body to apply state to.
     */
    this.initialize = body => {
        mover = body.createMover(
            (x + 2) * Pcb.PIXELS_PER_POINT * Terrain.METERS_PER_PIXEL,
            (y - 0.5) * Pcb.PIXELS_PER_POINT * Terrain.METERS_PER_PIXEL);
    };

    /**
     * Update the state.
     * @param {Array} state A state array to read from and/or write to.
     */
    this.tick = state => {
        if (state[pins[Propeller.PIN_INDEX_POWER]] === 1 && state[pins[Propeller.PIN_INDEX_ON]] === 1) {
            mover.setForce(new Myr.Vector(0, -3500));

            moving = true;
        }
        else {
            mover.setForce(null);

            moving = false;
        }
    };

    /**
     * Update the part.
     * @param {Number} timeStep The time step.
     */
    this.update = timeStep => {
        if (moving)
            renderer.getSprites()[Propeller.SPRITE_INDEX_PROPELLER].animate(timeStep);
    };
}

Propeller.PIN_INDEX_POWER = 0;
Propeller.PIN_INDEX_ON = 1;
Propeller.SPRITE_INDEX_PROPELLER = 1;