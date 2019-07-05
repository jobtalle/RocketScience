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
import {Altimeter} from "./parts/altimeter";
import {Comparator} from "./parts/comparator";
import {Tilt} from "./parts/tilt";
import {Subtractor} from "./parts/subtractor";
import {SensorSonar} from "./parts/sensorSonar";
import {GateXor} from "./parts/gateXor";

const objects = [
    Led,
    Oscillator,
    Battery,
    GateOr,
    GateXor,
    GateAnd,
    GateNot,
    Wheel,
    SensorTouch,
    Propeller,
    Controller,
    Button,
    Switch,
    Transistor,
    Meter,
    Resistor,
    Adder,
    Capacitor,
    Altimeter,
    Comparator,
    Tilt,
    Subtractor,
    SensorSonar];

const nameToId = {};
const idToName = {};
const idToObject = {};
const idToDefinition = {};
const ids = [];

for (let i = 0; i < objects.length; ++i) {
    ids.push(i);
    nameToId[objects[i].name] = i;
    idToName[i] = objects[i].name;
    idToObject[i] = objects[i];
}

for (const category of parts.categories)
    for (const part of category.parts)
        idToDefinition[nameToId[part.object]] = part;

/**
 * Get part state from its name.
 * @param {String} name The part name.
 * @returns {Object} the state object.
 */
export function getPartObject(name) {
    return idToObject[nameToId[name]];
}

/**
 * Get a unique id based on a part name.
 * @param {String} name The part name.
 * @returns {Number} A unique id. -1 if the part name is invalid.
 */
export function getPartId(name) {
    return nameToId[name];
}

/**
 * Get a part definition from parts.json based on its id,
 * retrieved from the getPartId function.
 * @param {Number} id A part id retrieved from the getPartId function.
 * @returns {Object|Null} A valid part configuration. If the id is invalid, null is returned.
 */
export function getPartDefinitionFromId(id) {
    return idToDefinition[id];
}

/**
 * Get a part definition from parts.json based on its name,
 * retrieved from the getPartId function.
 * @param {String} name The part name.
 * @return {Object|Null} A valid part configuration. If the id is invalid, null is returned.
 */
export function getPartDefinitionFromName(name) {
    return idToDefinition[nameToId[name]];
}

/**
 * Return all part ID's in an array.
 * @returns {Array} An array of numbers.
 */
export function getParts() {
    return ids;
}