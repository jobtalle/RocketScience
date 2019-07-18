import JSZip from "jszip";
import {loadObjects} from "./part/objects";
import {readAse} from "./sprites/asereader/aseReader";
import {getChunksPixels} from "./sprites/asereader/aseUtils";
import {registerSprites} from "./sprites/registerSprites";
import {pixelArrayToBase64} from "./utils/pixelArrayToBase64";
import {setLanguage} from "./text/language";

/**
 * Load the parts from all mods (in .zip format).
 * @param {Array} mods An array of paths to mod files (.zip)
 * @param {String} language A string representing the language JSON file.
 * @param {RenderContext} renderContext The render context of the game.
 * @param {Function} onLoad A function to call after loading all mods.
 */
export function loadParts(mods, language, renderContext, onLoad) {
    const PartMod = function() {
        this.icon = null;
        this.definition = null;
        this.implementation = null;
    };

    PartMod.FILE_ICON = "icon.aseprite";
    PartMod.FILE_DEFINITION = "definition.json";
    PartMod.FILE_IMPLEMENTATION = "implementation.js";

    let loading = 0;
    let modsLoaded = 0;
    let partsBuilt = false;

    const t = performance.now();
    const categorySets = [];
    const languageSets = [];
    const spriteFiles = [];

    const objects = [];
    const guiIcons = {};

    const parts = {categories: []};
    const partMods = {};

    const filesLoaded = () => {
        buildParts();
    };

    const fileLoaded = () => {
        if (modsLoaded === mods.length && loading === 0 && !partsBuilt)
            filesLoaded();
    };

    const fileLoad = load => {
        ++loading;

        load(() => {
            --loading;

            fileLoaded();
        });
    };

    const buildCategories = () => {
        for (const categories of categorySets)
            for (const label of categories.labels)
                if (parts.categories.indexOf(label) === -1)
                    parts.categories.push({
                        label: label,
                        parts: []
                    });

        // TODO: Properly sort categories if multiple definitions exist
    };

    const buildObjects = () => {
        for (const partName in partMods) if (partMods.hasOwnProperty(partName)) {
            for (const category of parts.categories) if (category.label === partMods[partName].definition.category) {
                category.parts.push(partMods[partName].definition);

                objects.push(partMods[partName].implementation);
                guiIcons[partMods[partName].definition.object] = partMods[partName].icon;

                break;
            }
        }

        for (const category of parts.categories)
            category.parts.sort((a, b) => a.label - b.label);
    };

    const buildParts = () => {
        buildCategories();
        buildObjects();

        registerSprites(renderContext.getMyr(), spriteFiles);
        loadObjects(objects, parts, guiIcons);
        setLanguage(
            language,
            languageSets,
            () => onLoad(),
            () => console.log("Language file was not found"));

        console.log("Part loading took " + (performance.now() - t) + "ms");

        partsBuilt = true;
    };

    const loadFileCommon = (fileName, data) => {
        switch (fileName) {
            case language:
                fileLoad(done => {
                    data.async("string").then(string => {
                        languageSets.push(JSON.parse(string));

                        done();
                    });
                });

                break;
            case "categories.json":
                fileLoad(done => {
                    data.async("string").then(string => {
                        categorySets.push(JSON.parse(string));

                        done();
                    });
                });

                break;
            default:
                if (fileName.endsWith(".aseprite")) {
                    fileLoad(done => {
                        data.async("arraybuffer").then(buffer => {
                            const sprite = readAse(buffer);

                            sprite.name = fileName.split(".")[0];

                            spriteFiles.push(sprite);

                            done();
                        });
                    });
                }

                break;
        }
    };

    const loadFileMod = (mod, fileName, data) => {
        if (partMods[mod] === undefined)
            partMods[mod] = new PartMod();

        const modFile = partMods[mod];

        switch (fileName) {
            case PartMod.FILE_ICON:
                fileLoad(done => {
                    data.async("arraybuffer").then(buffer => {
                        const ase = readAse(buffer);

                        modFile.icon = pixelArrayToBase64(
                            new Uint8ClampedArray(getChunksPixels(
                                ase.frames[0].chunks,
                                ase.header.width,
                                ase.header.height)),
                            ase.header.width,
                            ase.header.height);

                        done();
                    });
                });

                break;
            case PartMod.FILE_DEFINITION:
                fileLoad(done => {
                    data.async("string").then(string => {
                        modFile.definition = JSON.parse(string);

                        done();
                    });
                });

                break;
            case PartMod.FILE_IMPLEMENTATION:
                fileLoad(done => {
                    data.async("string").then(string => {
                        modFile.implementation = new Function('"use strict"; return(' + string + ')')();

                        done();
                    });
                });

                break;
        }
    };

    const loadFile = (directory, fileName, data) => {
        if (directory !== null && (
            fileName === PartMod.FILE_ICON ||
            fileName === PartMod.FILE_DEFINITION ||
            fileName === PartMod.FILE_IMPLEMENTATION))
            loadFileMod(directory, fileName, data);
        else
            loadFileCommon(fileName, data);
    };

    const loadRawFiles = () => {
        for (const modPath of mods)
            fetch(modPath)
                .then(response => response.arrayBuffer())
                .then(buffer => JSZip.loadAsync(buffer))
                .then(zip => {
                    zip.forEach((path, file) => {
                        if (path.endsWith("/"))
                            return;

                        const split = path.split("/");
                        const directory = split.length > 1 ? split[split.length - 2] : null;

                        loadFile(directory, split[split.length - 1], file);
                    });

                    ++modsLoaded;

                    fileLoaded();
                });
    };

    loadRawFiles();
}
