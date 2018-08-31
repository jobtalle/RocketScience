import {Pcb} from "../../../pcb/pcb";
import {Terrain} from "../../../world/terrain/terrain";

/**
 * @param {OscillatorBehavior} behavior A behavior object matching this state object.
 * @param {Array} pins An array containing the pin indices.
 * @param {PartRenderer} renderer A part renderer to render state to.
 * @constructor
 */
export function WheelState(behavior, pins, renderer) {
    /**
     * Initialize the state.
     * @param {Object} body A physics body to apply state to.
     */
    this.initialize = body => {
        body.getPhysics().createWheel(
            2.5 * Pcb.PIXELS_PER_POINT * Terrain.METERS_PER_PIXEL,
            body.getX(),
            body.getY(),
            renderer.getTransforms()[WheelState.SPRITE_INDEX_WHEEL]);
    };

    /**
     * Update the state.
     * @param {Array} state A state array to read from and/or write to.
     */
    this.tick = state => {

    };
}

WheelState.SPRITE_INDEX_WHEEL = 1;