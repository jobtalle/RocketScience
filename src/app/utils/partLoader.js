import JSZip from "jszip";
import {loadObjects} from "../part/objects";

function PartLoader() {
    let _counter = 0;
    let _onLoad;

    const _categoriesRaw = [];
    const _scriptsRaw = [];
    const _definitionsRaw = [];
    const _languageRaw = [];

    const _language = {};
    const _objects = [];
    const _parts = {categories: []};

    const isDuplicate = (label, array) => {
        for (const entry of array)
            if (entry.label === label)
                return true;

        return false;
    };

    const findInsertIndex = (label, array) => {
        if (array.indexOf(label) > 0)
            for (const category of _parts.categories)
                if (category.label === array[array.indexOf(label) - 1])
                    return _parts.categories.indexOf(category) + 1;

        return 0;
    };

    const buildCategories = () => {
        for (const text of _categoriesRaw) {
            const json = JSON.parse(text);

            for (const label of json.labels)
                if (!isDuplicate(label, _parts.categories))
                    _parts.categories.splice(findInsertIndex(label, json.labels), 0, {label: label, parts: []});
        }

        _categoriesRaw.splice(0, _categoriesRaw.length);
    };

    const buildDefinitions = () => {
        for (const text of _definitionsRaw) {
            const json = JSON.parse(text);

            for (const category of _parts.categories)
                if (category.label === json.category) {
                    if (!isDuplicate(json.label, category.parts))
                        category.parts.push(json);
                    else
                        console.log("Duplicate part entry: " + json.label);

                    break;
                }
        }

        for (const category of _parts.categories)
            category.parts.sort((a, b) => a.label - b.label);

        _definitionsRaw.splice(0, _definitionsRaw.length);
    };

    const buildScripts = () => {
        for (const text of _scriptsRaw)
            try {
                const script = new Function('"use strict"; return(' + text + ')')();

                if (!_objects.includes(script))
                    _objects.push(script);
                else
                    console.log("Duplicate script entry: " + text);
            } catch (e) {
                console.log(e);
                console.log("Unable to import following code:");
                console.log(text);
            }

        _scriptsRaw.splice(0, _scriptsRaw.length);
    };

    const buildLanguage = () => {
        for (const text of _languageRaw) {
            const json = JSON.parse(text);

            for (const key in json)
                if (!_language.hasOwnProperty(key))
                    _language[key] = json[key];
                else
                    console.log("Duplicate language entry: " + key + ", " + json[key]);
        }

        _languageRaw.splice(0, _languageRaw.length);
    };

    const buildParts = () => {
        buildCategories();
        buildDefinitions();
        buildScripts();
        buildLanguage();

        loadObjects(_objects, _parts);

        _objects.splice(0, _objects.length);

        _onLoad();
    };

    const addRaw = (file, array) => {
        ++_counter;
        file.async("string").then(text => {
            array.push(text);
            if (--_counter === 0)
                buildParts();
        });
    };

    const loadRawFiles = (mods, language) => {
        for (const modPath of mods)
            fetch(modPath)
                .then(response => response.arrayBuffer())
                .then(buffer => JSZip.loadAsync(buffer))
                .then(zip => zip.forEach((path, file) => {
                    if (path.endsWith("categories.json"))
                        addRaw(file, _categoriesRaw);
                    else if (path.endsWith(".js"))
                        addRaw(file, _scriptsRaw);
                    else if (path.endsWith(language))
                        addRaw(file, _languageRaw);
                    else if (path.endsWith("definition.json"))
                        addRaw(file, _definitionsRaw);
                }));
    };

    this.load = (mods, language, onLoad) => {
        _onLoad = onLoad;
        loadRawFiles(mods, language);
    };

    this.getParts = () => _parts;

    this.getLanguage = () => _language;
}

const _partLoader = new PartLoader();

/**
 * Load the parts from all mods (in .zip format).
 * @param {Array} mods An array of paths to mod files (.zip)
 * @param {String} language A string representing the language JSON file.
 * @param {Function} onLoad A function to call after loading all mods.
 */
export function loadParts(mods, language, onLoad) {
    _partLoader.load(mods, language, onLoad);
}

export function getParts() {
    return _partLoader.getParts();
}

export function getLanguage() {
    return _partLoader.getLanguage();
}