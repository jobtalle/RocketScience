import {LedBehavior} from "./parts/led/ledBehavior";
import {OscillatorBehavior} from "./parts/oscillator/oscillatorBehavior";
import {LedPhysics} from "./parts/led/ledPhysics";
import {OscillatorPhysics} from "./parts/oscillator/oscillatorPhysics";
import {LedState} from "./parts/led/ledState";
import {OscillatorState} from "./parts/oscillator/oscillatorState";

const behaviors = {
    "Led": LedBehavior,
    "Oscillator": OscillatorBehavior
};

const physics = {
    "Led": LedPhysics,
    "Oscillator": OscillatorPhysics
};

const states = {
    "Led": LedState,
    "Oscillator": OscillatorState
};

/**
 * Get part behavior from its name.
 * @param {String} name The part name.
 * @returns {Object} the behavior object.
 */
export function getPartBehavior(name) {
    return behaviors[name];
}

/**
 * Get part physics from its name.
 * @param {String} name The part name.
 * @returns {Object} the physics object.
 */
export function getPartPhysics(name) {
    return physics[name];
}

/**
 * Get part state from its name.
 * @param {String} name The part name.
 * @returns {Object} the state object.
 */
export function getPartState(name) {
    return states[name];
}