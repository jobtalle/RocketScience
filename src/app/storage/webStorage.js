/**
 * Storage for larger files up to 5MB in total size
 * @constructor
 */
export function WebStorage() {

    /**
     * Set a value in the web storage
     * @param key {String} The key of the stored data
     * @param value {String} The value that should be assigned to the key.
     */
    this.setItem = (key, value) => {
        localStorage.setItem(key, value);
    };

    /**
     * Get an item from the web storage
     * @param key {String} The key of the data
     * @returns {String} The value that is stored
     */
    this.getItem = (key) => {
        return localStorage.getItem(key);
    };

    /**
     * Removes an item from web storage which is held by the key
     * @param key {String} The key of the item that should be deleted
     */
    this.removeItem = (key) => {
        localStorage.removeItem(key);
    };

    /**
     * Get all the keys in the web storage
     * @returns {String[]} A list of keys
     */
    this.getAllKeys = () => {
        return Object.keys(localStorage);
    };
}