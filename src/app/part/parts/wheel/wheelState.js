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
    /**
     * Initialize the state.
     * @param {Object} body A physics body to apply state to.
     */
    this.initialize = (body) => {
        body.createWheel(
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

    };
}

WheelState.SPRITE_INDEX_WHEEL = 1;
WheelState.RADIUS = 2.5;
WheelState.ANCHOR_X = 1.5;
WheelState.ANCHOR_Y = 1.5;