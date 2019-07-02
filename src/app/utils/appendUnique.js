/**
 * Append all language entries to a destination dictionary.
 * If the same key-value pair is found, the function will notify the user.
 * If the same key is already used for a different value in the destination dictionary, the function will throw
 * an exception.
 * @param {Object} src The source dictionary.
 * @param {Object} dest The destination dictionary.
 * @param {String} duplicateText The string to print as the exception text.
 */
export function appendLanguageUnique(src, dest, duplicateText) {
    for (const key in src)
        if (dest.hasOwnProperty(key)) {
            if (dest[key] === src[key])
                console.log(duplicateText + ": " + key + ", " + dest[key]);
            else
                throw duplicateText + ": " + key + ", " + src[key] + "; " + dest[key];
        } else
            dest[key] = src[key];
}

/**
 * Adds a unique string to an array. If the string already exists in the array, the string is ignored.
 * @param {String} text The string to add to the array.
 * @param {Array} array The array to add the string to.
 */
export function appendStringUnique(text, array) {
    for (const entry of array)
        if (entry === text) {
            console.log("Duplicate string ignored: " + text);
            return;
        }

    array.push(text);
}

/**
 * Adds a new unique entry to a dictionary of arraybuffers.
 * Throws an exception if the key is already used for a different buffer.
 * @param {String} key The key to the new entry.
 * @param {ArrayBuffer} buffer The arraybuffer to add.
 * @param {Object} dict The dictionary to add the entry to.
 */
export function appendArrayBufferUnique(key, buffer, dict) {
    if (dict.hasOwnProperty(key)) {
        const decoder = new TextDecoder("utf-8");

        if (decoder.decode(buffer) === decoder.decode(dict[key]))
            console.log("Duplicate sprite ignored: " + key);
        else
            throw "Multiple instances of same sprite name! " + key;
    } else
        dict[key] = buffer;
}