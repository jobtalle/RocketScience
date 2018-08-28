import {LedBehavior} from "./parts/led/ledBehavior";
import {OscillatorBehavior} from "./parts/oscillator/oscillatorBehavior";
import {LedState} from "./parts/led/ledState";
import {OscillatorState} from "./parts/oscillator/oscillatorState";
import {BatteryBehavior} from "./parts/battery/batteryBehavior";
import {BatteryState} from "./parts/battery/batteryState";

// TODO: Can this be automated? E.G.:
/*
var context = require.context(".", true, /\.js$/);
var obj = {};
context.keys().forEach(function (key) {
    obj[key] = context(key);
});
 */

const behaviors = {
    "Led": LedBehavior,
    "Oscillator": OscillatorBehavior,
    "Battery": BatteryBehavior
};

const states = {
    "Led": LedState,
    "Oscillator": OscillatorState,
    "Battery": BatteryState
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
 * Get part state from its name.
 * @param {String} name The part name.
 * @returns {Object} the state object.
 */
export function getPartState(name) {
    return states[name];
}