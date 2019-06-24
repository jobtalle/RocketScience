import JSZip from "jszip";
import {Led} from "../part/parts/led";
import {Oscillator} from "../part/parts/oscillator";
import {Battery} from "../part/parts/battery";
import {GateOr} from "../part/parts/gateOr";
import {GateXor} from "../part/parts/gateXor";
import {GateAnd} from "../part/parts/gateAnd";
import {GateNot} from "../part/parts/gateNot";
import {Wheel} from "../part/parts/wheel";
import {SensorTouch} from "../part/parts/sensorTouch";
import {Propeller} from "../part/parts/propeller";
import {Controller} from "../part/parts/controller";
import {Button} from "../part/parts/button";
import {Switch} from "../part/parts/switch";
import {Transistor} from "../part/parts/transistor";
import {Meter} from "../part/parts/meter";
import {Resistor} from "../part/parts/resistor";
import {Adder} from "../part/parts/adder";
import {Capacitor} from "../part/parts/capacitor";
import {Altimeter} from "../part/parts/altimeter";
import {Comparator} from "../part/parts/comparator";
import {Tilt} from "../part/parts/tilt";
import {Subtractor} from "../part/parts/subtractor";
import {SensorSonar} from "../part/parts/sensorSonar";
import {loadObjects} from "../part/objects";
import parts from "../../assets/parts.json"

function PartLoader() {
    const _zip = new JSZip();
    let _counter = 0;
    let _onLoad;

    const _objects = [
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

    const _parts = parts;

    const _language = {};
    // const _objects = [];
    // const _parts = {categories: []};

    const onFinish = () => {
        _counter--;
        if (_counter === 0) {
            for (const category of _parts.categories)
                category.parts.sort((a, b) => a.label - b.label);
            loadObjects(_objects, _parts);
            _onLoad();
        }
    };

    const loadScript = file => {
        _counter++;
        file.async("string").then(text => {
            try {
                _objects.push(new Function('"use strict"; return(' + text + ')')());
            } catch (e) {
                console.log(e);
                console.log("Unable to import following code:");
                console.log(text);
            }

            onFinish();
        });
    };

    const loadLanguage = file => {
        _counter++;
        file.async("string").then(text => {
            const json = JSON.parse(text);
            for (const key in json) {
                if (!_language.hasOwnProperty(key)) {
                    _language[key] = json[key];
                } else {
                    console.log("Duplicate language entry: " + key + ", " + json[key]);
                }
            }

            onFinish();
        });
    };

    const loadDefinition = file => {
        _counter++;
        file.async("string").then(text => {
            const json = JSON.parse(text);
            for (const category of _parts.categories) {
                if (category.label === json.category) {
                    let duplicate = false;
                    for (const part of category.parts) {
                        if (part.label === json.label) {
                            duplicate = true;

                            break;
                        }
                    }
                    if (!duplicate)
                        category.parts.push(json);
                    else
                        console.log("Duplicate part entry: " + json.label);

                    break;
                }
            }

            onFinish();
        });
    };

    const loadParts = (mods, language) => {
        for (const modPath of mods) {
            fetch(modPath)
                .then(response => response.arrayBuffer())
                .then(buffer => _zip.loadAsync(buffer))
                .then(zip => zip.forEach((path, file) => {
                    if (path.endsWith(".js"))
                        loadScript(file);
                    else if (path.endsWith(language))
                        loadLanguage(file);
                    else if (path.endsWith("definition.json"))
                        loadDefinition(file);
                }));
        }
    };

    const loadCategories = (mods, language) => {
        for (const modPath of mods)
            fetch(modPath)
                .then(response => response.arrayBuffer())
                .then(buffer => _zip.loadAsync(buffer))
                .then(zip => zip.forEach((path, file) => {
                    if (path.endsWith("categories.json")) {
                        _counter++;
                        file.async("string").then(text => {
                            const json = JSON.parse(text);

                            for (const label of json.labels) {
                                let duplicate = false;

                                for (const category of _parts.categories)
                                    if (label === category.label) {
                                        duplicate = true;

                                        break;
                                    }
                                if (!duplicate) {
                                    let insertIndex = 0;

                                    if (json.labels.indexOf(label) > 0)
                                        for (const category of _parts.categories)
                                            if (category.label === json.labels[json.labels.indexOf(label) - 1]) {
                                                insertIndex = _parts.categories.indexOf(category) + 1;

                                                break;
                                            }
                                    _parts.categories.splice(insertIndex, 0, {label: label, parts: []});
                                }
                            }

                            _counter--;
                            if (_counter === 0)
                                loadParts(mods, language);
                        });
                    }
                }));
    };

    this.load = (mods, language, onLoad) => {
        _onLoad = onLoad;
        loadCategories(mods, language);
    };

    this.getParts = () => _parts;

    this.getLanguage = () => _language;
}

const _partLoader = new PartLoader();

export function loadParts(mods, language, onLoad) {
    _partLoader.load(mods, language, onLoad);
}

export function getParts() {
    return _partLoader.getParts();
}

export function getLanguage() {
    return _partLoader.getLanguage();
}