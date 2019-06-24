import {SpringApproach} from "../utils/springApproach";
import {Scale} from "../world/scale";
import Myr from "myr.js";
import {ContactListener} from "../world/physics/contactListener";

const refs = {
    Myr: Myr,
    Scale: Scale,
    SpringApproach: SpringApproach,
    ContactListener: ContactListener
};

/**
 * This function constructs a reference object for a part constructor.
 * @param {Array} pins The pin references.
 * @param {PartRenderer} renderer The part renderer.
 * @param {Number} x The X location on the board.
 * @param {Number} y The Y location on the board.
 * @returns {Object} The context object.
 */
export const makeContext = (pins, renderer, x, y) => {
    return {
        pins: pins,
        renderer: renderer,
        x: x,
        y: y,
        refs: refs
    }
};