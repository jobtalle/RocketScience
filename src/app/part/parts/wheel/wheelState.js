import {Pcb} from "../../../pcb/pcb";
import {Terrain} from "../../../world/terrain/terrain";

/**
 * @param {OscillatorBehavior} behavior A behavior object matching this state object.
 * @param {Array} pins An array containing the pin indices.
 * @param {PartRenderer} renderer A part renderer to render state to.
 * @param {Number} x The X location on the board.
 * @param {Number} y The Y location on the board.
 * @constructor
 */
export function WheelState(behavior, pins, renderer, x, y) {
    let currentState = WheelState.STATE_RELEASED;
    let joint = null;

    const applyState = state => {
        switch (state) {
            case WheelState.STATE_RELEASED:
                joint.release();
                break;
            case WheelState.STATE_BRAKES:
                joint.brakes();
                break;
            case WheelState.STATE_MOTOR_RIGHT:
                joint.powerRight();
                break;
            case WheelState.STATE_MOTOR_LEFT:
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
            WheelState.RADIUS * Pcb.PIXELS_PER_POINT * Terrain.METERS_PER_PIXEL,
            (x + WheelState.ANCHOR_X) * Pcb.PIXELS_PER_POINT * Terrain.METERS_PER_PIXEL,
            (y + WheelState.ANCHOR_Y) * Pcb.PIXELS_PER_POINT * Terrain.METERS_PER_PIXEL,
            renderer.getTransforms()[WheelState.SPRITE_INDEX_WHEEL]);
    };

    /**
     * Update the state.
     * @param {Array} state A state array to read from and/or write to.
     */
    this.tick = state => {
        let newState;

        if (state[pins[WheelState.PIN_INDEX_POWER]] === 1) {
            if (state[pins[WheelState.PIN_INDEX_BRAKES_1]] === 1 || state[pins[WheelState.PIN_INDEX_BRAKES_2]] === 1)
                newState = WheelState.STATE_BRAKES;
            else if (state[pins[WheelState.PIN_INDEX_LEFT]] === 1)
                newState = WheelState.STATE_MOTOR_LEFT;
            else if (state[pins[WheelState.PIN_INDEX_RIGHT]] === 1)
                newState = WheelState.STATE_MOTOR_RIGHT;
            else
                newState = WheelState.STATE_RELEASED;
        }
        else {
            newState = WheelState.STATE_RELEASED;
        }

        if (newState !== currentState) {
            currentState = newState;

            applyState(currentState);
        }
    };
}

WheelState.SPRITE_INDEX_WHEEL = 1;
WheelState.RADIUS = 2.5;
WheelState.ANCHOR_X = 1.5;
WheelState.ANCHOR_Y = 1.5;
WheelState.PIN_INDEX_LEFT = 0;
WheelState.PIN_INDEX_POWER = 1;
WheelState.PIN_INDEX_RIGHT = 2;
WheelState.PIN_INDEX_BRAKES_1 = 3;
WheelState.PIN_INDEX_BRAKES_2 = 4;
WheelState.STATE_RELEASED = 0;
WheelState.STATE_BRAKES = 1;
WheelState.STATE_MOTOR_RIGHT = 2;
WheelState.STATE_MOTOR_LEFT = 3;