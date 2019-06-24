import JSZip from "jszip";
import {loadObjects} from "../part/objects";

function PartLoader() {
    let _counter = 0;
    let _onLoad;

    const _language = {};
    const _objects = [];
    const _parts = {categories: []};

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

    const loadParts = (zip, language) => {
        zip.forEach((path, file) => {
            if (path.endsWith(".js"))
                loadScript(file);
            else if (path.endsWith(language))
                loadLanguage(file);
            else if (path.endsWith("definition.json"))
                loadDefinition(file);
        });
    };

    const loadCategories = (mods, language) => {
        for (const modPath of mods) {
            fetch(modPath)
                .then(response => response.arrayBuffer())
                .then(buffer => JSZip.loadAsync(buffer))
                .then(zip => {
                    zip.forEach((path, file) => {
                        if (path.endsWith("categories.json")) {
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
                                loadParts(zip, language);
                            });
                        }
                    })
                });
        }
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