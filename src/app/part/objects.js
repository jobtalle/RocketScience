import {Led} from "./parts/led";
import {Oscillator} from "./parts/oscillator";
import {Battery} from "./parts/battery";
import {GateOr} from "./parts/gateOr";
import {GateAnd} from "./parts/gateAnd";
import {GateNot} from "./parts/gateNot";
import {Wheel} from "./parts/wheel";
import {SensorTouch} from "./parts/sensorTouch";

// TODO: Can this be automated? E.G.:
/*
var context = require.context(".", true, /\.js$/);
var obj = {};
context.keys().forEach(function (key) {
    obj[key] = context(key);
});
 */

const states = {
    "Led": Led,
    "Oscillator": Oscillator,
    "Battery": Battery,
    "GateOr": GateOr,
    "GateAnd": GateAnd,
    "GateNot": GateNot,
    "Wheel": Wheel,
    "SensorTouch": SensorTouch
};

/**
 * Get part state from its name.
 * @param {String} name The part name.
 * @returns {Object} the state object.
 */
export function getPartObject(name) {
    return states[name];
}