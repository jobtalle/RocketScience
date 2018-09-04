import {LedBehavior} from "./parts/led/ledBehavior";
import {OscillatorBehavior} from "./parts/oscillator/oscillatorBehavior";
import {LedState} from "./parts/led/ledState";
import {OscillatorState} from "./parts/oscillator/oscillatorState";
import {BatteryBehavior} from "./parts/battery/batteryBehavior";
import {BatteryState} from "./parts/battery/batteryState";
import {GateOrBehavior} from "./parts/or/gateOrBehavior";
import {GateOrState} from "./parts/or/gateOrState";
import {GateAndBehavior} from "./parts/and/gateAndBehavior";
import {GateAndState} from "./parts/and/gateAndState";
import {WheelBehavior} from "./parts/wheel/wheelBehavior";
import {WheelState} from "./parts/wheel/wheelState";

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
    "Battery": BatteryBehavior,
    "GateOr": GateOrBehavior,
    "GateAnd": GateAndBehavior,
    "Wheel": WheelBehavior
};

const states = {
    "Led": LedState,
    "Oscillator": OscillatorState,
    "Battery": BatteryState,
    "GateOr": GateOrState,
    "GateAnd": GateAndState,
    "Wheel": WheelState
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