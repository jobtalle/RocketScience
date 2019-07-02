import JSZip from "jszip";
import {loadObjects} from "../part/objects";
import {readAse} from "../sprites/asereader/aseReader";
import {forAllIcons, forAllSprites, forChunkPixels} from "./aseutils";
import {setLanguage} from "../text/language";
import {registerSprites} from "../sprites/registerSprites";
import {pixelArrayToBase64} from "./pixelArrayToBase64";
import {appendArrayBufferUnique, appendLanguageUnique, appendSpriteUnique, appendStringUnique} from "./appendUnique";

/**
 * Load the parts from all mods (in .zip format).
 * @param {Array} mods An array of paths to mod files (.zip)
 * @param {String} language A string representing the language JSON file.
 * @param {RenderContext} renderContext The render context of the game.
 * @param {Function} onLoad A function to call after loading all mods.
 */
export function loadParts(mods, language, renderContext, onLoad) {
    let _counter = 0;
    let _modsLoaded = 0;
    let _partBuilt = false;

    const _categoriesRaw = [];
    const _scriptsRaw = [];
    const _definitionsRaw = [];
    const _languageRaw = [];
    const _spriteRawBuffers = {};
    const _spriteRawFiles = [];
    const _guiRawFiles = [];

    const _objects = [];
    const _languageEntries = {};
    const _parts = {categories: []};
    const _guiIcons = {};

    const isDuplicateLabel = (label, array) => {
        for (const entry of array)
            if (entry.label === label)
                return true;

        return false;
    };

    const isDuplicateName = (name, array) => {
        for (const entry of array)
            if (entry.name === name)
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
                if (!isDuplicateLabel(label, _parts.categories))
                    _parts.categories.splice(findInsertIndex(label, json.labels), 0, {label: label, parts: []});
        }
    };

    const buildDefinitions = () => {
        for (const text of _definitionsRaw) {
            const json = JSON.parse(text);

            for (const category of _parts.categories)
                if (category.label === json.category) {
                    if (!isDuplicateLabel(json.label, category.parts))
                        category.parts.push(json);
                    else
                        throw "Duplicate part entry: " + json.label;

                    break;
                }
        }

        for (const category of _parts.categories)
            category.parts.sort((a, b) => a.label - b.label);
    };

    const buildScripts = () => {
        for (const text of _scriptsRaw) {
            const script = new Function('"use strict"; return(' + text + ')')();

            if (!isDuplicateName(script.name, _objects))
                _objects.push(script);
            else
                throw "Duplicate script entry: " + text;
        }
    };

    const buildLanguage = () => {
        for (const text of _languageRaw) {
            const json = JSON.parse(text);

            appendLanguageUnique(json, _languageEntries, "Duplicate language entry");
        }
    };

    const readSpriteFiles = () => {
        forAllSprites(_parts, sprite => {
            if (!_spriteRawBuffers.hasOwnProperty(sprite))
                throw "Missing sprite file: " + sprite;

            const file = readAse(_spriteRawBuffers[sprite]);

            file.name = sprite;
            if (!isDuplicateName(file.name, _spriteRawFiles))
                _spriteRawFiles.push(file);
        });
    };

    const readGuiSpriteFiles = () => {
        forAllIcons(_parts, icon => {
            if (!_spriteRawBuffers.hasOwnProperty(icon))
                throw "Missing sprite file: " + icon;

            const file = readAse(_spriteRawBuffers[icon]);

            file.name = icon;
            if (!isDuplicateName(file.name, _guiRawFiles))
                _guiRawFiles.push(file);
        });
    };

    const buildGuiIcons = () => {
        for (const file of _guiRawFiles)
            for (const frame of file.frames) {
                const pixelArray = new Uint8ClampedArray(file.header.width * file.header.height * 4);

                forChunkPixels(frame.chunks, (x, y, chunk) => {
                    pixelArray[(x + chunk.xpos + (y + chunk.ypos) * file.header.width) * 4] = chunk.pixels[y][x].r;
                    pixelArray[(x + chunk.xpos + (y + chunk.ypos) * file.header.width) * 4 + 1] = chunk.pixels[y][x].g;
                    pixelArray[(x + chunk.xpos + (y + chunk.ypos) * file.header.width) * 4 + 2] = chunk.pixels[y][x].b;
                    pixelArray[(x + chunk.xpos + (y + chunk.ypos) * file.header.width) * 4 + 3] = chunk.pixels[y][x].a;
                });

                _guiIcons[file.name] = pixelArrayToBase64(pixelArray, file.header.width, file.header.height)
            }
    };

    const buildParts = () => {
        _partBuilt = true;

        buildCategories();
        buildDefinitions();
        buildScripts();
        buildLanguage();
        readSpriteFiles();
        readGuiSpriteFiles();
        buildGuiIcons();

        registerSprites(renderContext.getMyr(), _spriteRawFiles);
        loadObjects(_objects, _parts, _guiIcons);
        setLanguage(language, _languageEntries, () => onLoad(renderContext), () => console.log("Language file was not found"));
    };

    const addRaw = (file, array) => {
        ++_counter;
        file.async("string").then(text => {
            appendStringUnique(text, array);

            if (--_counter === 0 && _modsLoaded === mods.length)
                buildParts();
        });
    };

    const addRawBuffer = (file, path, dict) => {
        ++_counter;
        file.async("arraybuffer").then(buffer => {
            const name = path.split('/').pop().split('.')[0];
            appendArrayBufferUnique(name, buffer, dict);

            if (--_counter === 0 && _modsLoaded === mods.length)
                buildParts();
        });
    };

    const loadRawFiles = () => {
        for (const modPath of mods)
            fetch(modPath)
                .then(response => response.arrayBuffer())
                .then(buffer => JSZip.loadAsync(buffer))
                .then(zip => {
                    zip.forEach((path, file) => {
                        if (path.endsWith("categories.json"))
                            addRaw(file, _categoriesRaw);
                        else if (path.endsWith(".js"))
                            addRaw(file, _scriptsRaw);
                        else if (path.endsWith(language))
                            addRaw(file, _languageRaw);
                        else if (path.endsWith("definition.json"))
                            addRaw(file, _definitionsRaw);
                        else if (path.endsWith(".aseprite") || path.endsWith(".ase"))
                            addRawBuffer(file, path, _spriteRawBuffers);
                    });
                    
                    if (++_modsLoaded === mods.length && _counter === 0 && _partBuilt === false)
                        buildParts();
                });
    };

    loadRawFiles();
}
