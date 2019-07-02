function ObjectLoader() {
    const nameToId = {};
    const idToName = {};
    const idToObject = {};
    const idToDefinition = {};
    const ids = [];

    let _parts;
    let _guiIconStrings;

    this.load = (objects, parts, guiIcons) => {
        for (let i = 0; i < objects.length; ++i) {
            ids.push(i);
            nameToId[objects[i].name] = i;
            idToName[i] = objects[i].name;
            idToObject[i] = objects[i];
        }

        for (const category of parts.categories)
            for (const part of category.parts)
                idToDefinition[nameToId[part.object]] = part;

        _parts = parts;
        _guiIconStrings = guiIcons;
    };

    this.getPartObject = name => {
        return idToObject[nameToId[name]];
    };

    this.getPartId = name => {
        return nameToId[name];
    };

    this.getPartFromId = id => {
        return idToDefinition[id];
    };

    this.getPartIds = () => {
        return ids;
    };

    this.getParts = () => {
        return _parts;
    };

    this.getGuiIconStrings = () => {
        return _guiIconStrings;
    };
}

const _objectLoader = new ObjectLoader();

/**
 * Load all part objects, icons and specifications.
 * @param {Array} objects An array of part objects.
 * @param {Object} parts A JSON definition of all parts.
 * @param {Object} guiIcons A dictionary of all icons per part.
 */
export function loadObjects(objects, parts, guiIcons) {
    _objectLoader.load(objects, parts, guiIcons);
}

/**
 * Get part state from its name.
 * @param {String} name The part name.
 * @returns {Object} the state object.
 */
export function getPartObject(name) {
    return _objectLoader.getPartObject(name);
}

/**
 * Get a unique id based on a part name.
 * @param {String} name The part name.
 * @returns {Number} A unique id. -1 if the part name is invalid.
 */
export function getPartId(name) {
    return _objectLoader.getPartId(name);
}

/**
 * Get a part definition from parts.json based on its id,
 * retrieved from the getPartId function.
 * @param {Number} id A part id retrieved from the getPartId function.
 * @returns {Object} A valid part configuration. If the id is invalid, null is returned.
 */
export function getPartFromId(id) {
    return _objectLoader.getPartFromId(id);
}

/**
 * Return all part ID's in an array.
 * @returns {Array} An array of numbers.
 */
export function getPartIds() {
    return _objectLoader.getPartIds();
}

/**
 * Return the specification for the parts.
 * @returns {Object}
 */
export function getParts() {
    return _objectLoader.getParts();
}

/**
 * Return the base64 encoded PNG of the icon.
 * @param {String} part The part name.
 * @returns {String} A base64 encoded PNG.
 */
export function getGuiIconString(part) {
    return _objectLoader.getGuiIconStrings()[part];
}