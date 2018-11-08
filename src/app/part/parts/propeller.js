import {Scale} from "../../world/scale";
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
            (x + 2) * Scale.METERS_PER_POINT,
            (y - 0.5) * Scale.METERS_PER_POINT);
    };

    /**
     * Update the state.
     * @param {Array} state A state array to read from and/or write to.
     */
    this.tick = state => {
        if (state[pins[Propeller.PIN_INDEX_POWER]] === 1 && state[pins[Propeller.PIN_INDEX_INPUT]] !== 0) {
            mover.setForce(new Myr.Vector(0, Propeller.MAX_FORCE * state[pins[Propeller.PIN_INDEX_INPUT]]));

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
Propeller.PIN_INDEX_INPUT = 1;
Propeller.SPRITE_INDEX_PROPELLER = 1;
Propeller.MAX_FORCE = -4500;