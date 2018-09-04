import {Pcb} from "../../pcb/pcb";
import {Terrain} from "../../world/terrain/terrain";

/**
 * @param {Array} pins An array containing the pin indices.
 * @param {PartRenderer} renderer A part renderer to render state to.
 * @param {Number} x The X location on the board.
 * @param {Number} y The Y location on the board.
 * @constructor
 */
export function Wheel(pins, renderer, x, y) {
    let currentState = Wheel.STATE_RELEASED;
    let joint = null;

    const applyState = state => {
        switch (state) {
            case Wheel.STATE_RELEASED:
                joint.release();
                break;
            case Wheel.STATE_BRAKES:
                joint.brakes();
                break;
            case Wheel.STATE_MOTOR_RIGHT:
                joint.powerRight();
                break;
            case Wheel.STATE_MOTOR_LEFT:
                joint.powerLeft();
                break;
        }
    };

    /**
     * Initialize the state.
     * @param {Object} body A physics body to apply state to.
     */
    this.initialize = body => {
        joint = body.createWheel(
            Wheel.RADIUS * Pcb.PIXELS_PER_POINT * Terrain.METERS_PER_PIXEL,
            (x + Wheel.ANCHOR_X) * Pcb.PIXELS_PER_POINT * Terrain.METERS_PER_PIXEL,
            (y + Wheel.ANCHOR_Y) * Pcb.PIXELS_PER_POINT * Terrain.METERS_PER_PIXEL,
            renderer.getTransforms()[Wheel.SPRITE_INDEX_WHEEL]);
    };

    /**
     * Update the state.
     * @param {Array} state A state array to read from and/or write to.
     */
    this.tick = state => {
        let newState;

        if (state[pins[Wheel.PIN_INDEX_POWER]] === 1) {
            if (state[pins[Wheel.PIN_INDEX_BRAKES_1]] === 1 || state[pins[Wheel.PIN_INDEX_BRAKES_2]] === 1)
                newState = Wheel.STATE_BRAKES;
            else if (state[pins[Wheel.PIN_INDEX_LEFT]] === 1)
                newState = Wheel.STATE_MOTOR_LEFT;
            else if (state[pins[Wheel.PIN_INDEX_RIGHT]] === 1)
                newState = Wheel.STATE_MOTOR_RIGHT;
            else
                newState = Wheel.STATE_RELEASED;
        }
        else {
            newState = Wheel.STATE_RELEASED;
        }

        if (newState !== currentState) {
            currentState = newState;

            applyState(currentState);
        }
    };
}

Wheel.SPRITE_INDEX_WHEEL = 1;
Wheel.RADIUS = 2.5;
Wheel.ANCHOR_X = 1.5;
Wheel.ANCHOR_Y = 1.5;
Wheel.PIN_INDEX_LEFT = 0;
Wheel.PIN_INDEX_POWER = 1;
Wheel.PIN_INDEX_RIGHT = 2;
Wheel.PIN_INDEX_BRAKES_1 = 3;
Wheel.PIN_INDEX_BRAKES_2 = 4;
Wheel.STATE_RELEASED = 0;
Wheel.STATE_BRAKES = 1;
Wheel.STATE_MOTOR_RIGHT = 2;
Wheel.STATE_MOTOR_LEFT = 3;