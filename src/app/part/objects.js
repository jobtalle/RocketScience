import {Led} from "./parts/led";
import {Oscillator} from "./parts/oscillator";
import {Battery} from "./parts/battery";
import {GateOr} from "./parts/gateOr";
import {GateAnd} from "./parts/gateAnd";
import {GateNot} from "./parts/gateNot";
import {Wheel} from "./parts/wheel";
import {SensorTouch} from "./parts/sensorTouch";
import {Propeller} from "./parts/propeller";
import {Controller} from "./parts/controller";
import parts from "../../assets/parts.json"
import {Button} from "./parts/button";
import {Switch} from "./parts/switch";
import {Transistor} from "./parts/transistor";
import {Meter} from "./parts/meter";
import {Resistor} from "./parts/resistor";
import {Adder} from "./parts/adder";
import {Capacitor} from "./parts/capacitor";

const states = {
    "Led": Led,
    "Oscillator": Oscillator,
    "Battery": Battery,
    "GateOr": GateOr,
    "GateAnd": GateAnd,
    "GateNot": GateNot,
    "Wheel": Wheel,
    "SensorTouch": SensorTouch,
    "Propeller": Propeller,
    "Controller": Controller,
    "Button": Button,
    "Switch": Switch,
    "Transistor": Transistor,
    "Meter": Meter,
    "Resistor": Resistor,
    "Adder": Adder,
    "Capacitor": Capacitor
};

/**
 * Get part state from its name.
 * @param {String} name The part name.
 * @returns {Object} the state object.
 */
export function getPartObject(name) {
    return states[name];
}

/**
 * Get a unique id based on a part name.
 * @param {String} name The part name.
 * @returns {Number} A unique id. -1 if the part name is invalid.
 */
export function getPartId(name) {
    return Object.keys(states).indexOf(name);
}

/**
 * Get a part definition from parts.json based on its id,
 * retrieved from the getPartId function.
 * @param {Number} id A part id retrieved from the getPartId function.
 * @returns {Object} A valid part configuration. If the id is invalid, null is returned.
 */
export function getPartFromId(id) {
    const object = Object.keys(states)[id];

    for (const category of parts.categories) {
        for (const part of category.parts) {
            if (part.object === object)
                return part;
        }
    }

    return null;
}