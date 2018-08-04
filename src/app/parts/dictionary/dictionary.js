import {Led} from "../led";

const parts = {};

parts["Led"] = Led;

/**
 * Resolve a part object from its name.
 * @param {String} name The part name, as provided by parts.json.
 * @returns {Object} The part constructor.
 */
export function getPart(name) {
    return parts[name];
}