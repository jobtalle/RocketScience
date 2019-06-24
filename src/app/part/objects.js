function ObjectLoader() {
    const nameToId = {};
    const idToName = {};
    const idToObject = {};
    const idToDefinition = {};
    const ids = [];

    this.load = (objects, parts) => {
        for (let i = 0; i < objects.length; ++i) {
            ids.push(i);
            nameToId[objects[i].name] = i;
            idToName[i] = objects[i].name;
            idToObject[i] = objects[i];
        }

        for (const category of parts.categories)
            for (const part of category.parts)
                idToDefinition[nameToId[part.object]] = part;
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
}

const _objectLoader = new ObjectLoader();

export function loadObjects(objects, parts) {
    _objectLoader.load(objects, parts);
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