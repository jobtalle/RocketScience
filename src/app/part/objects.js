function ObjectLoader() {
    const nameToObject = {};
    const nameToDefinition = {};
    const names = [];

    let _parts;
    let _guiIconStrings;

    this.load = (objects, parts, guiIcons) => {
        for (const object of objects) {
            nameToObject[object.name] = object;
            names.push(object.name);
        }

        for (const category of parts.categories)
            for (const part of category.parts)
                nameToDefinition[part.object] = part;

        _parts = parts;
        _guiIconStrings = guiIcons;
    };

    this.getPartObject = name => {
        return nameToObject[name];
    };

    this.getPartFromName = name => {
        return nameToDefinition[name];
    };

    this.getPartNames = () => {
        return names;
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
 * Get a part definition from parts.json based on its name
 * @param {String} name A part name.
 * @returns {Object} A valid part configuration. If the name is invalid, null is returned.
 */
export function getPartFromName(name) {
    return _objectLoader.getPartFromName(name);
}

/**
 * Return all part names in an array.
 * @returns {Array} An array of strings.
 */
export function getPartNames() {
    return _objectLoader.getPartNames();
}

/**
 * Return the definition for the parts.
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