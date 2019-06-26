/**
 * A PCB part dictionary, assigning an index to all parts in a PCB.
 * @param {PartSummary} [summary] A part summary of a PCB.
 * @constructor
 */

export function PcbPartDict(summary) {
    const _parts = [];

    const build = summary => {
        for (const key of Object.keys(summary.getEntries()))
            _parts.push(key);
    };

    /**
     * Add a part name to the dictionary.
     * @param {String} part A part name.
     */
    this.add = part => {
        _parts.push(part);
    };

    /**
     * Get the ID of a part by name.
     * @param {String} name The name of the part.
     */
    this.getID = name => {
        return _parts.indexOf(name);
    };

    /**
     * Get the name of a part by ID.
     * @param {Number} id The ID, which must be a valid ID in this dictionary.
     */
    this.getPart = id => {
        return _parts[id];
    };

    /**
     * Serialize this part dictionary.
     * @param {ByteBuffer} buffer A byte buffer to serialize this part dictionary to.
     */
    this.serialize = buffer => {
        buffer.writeShort(_parts.length);

        for (const part of _parts)
            buffer.writeString(part);
    };

    if (summary)
        build(summary);
}

/**
 * Deserialize a part dictionary.
 * @param {ByteBuffer} buffer A byte buffer to serialize a part dictionary from.
 * @returns {PcbPartDict} A PcbPartDict object.
 */
PcbPartDict.deserialize = buffer => {
    const parts = buffer.readShort();
    const dict = new PcbPartDict();

    for (let i = 0; i < parts; ++i)
        dict.add(buffer.readString());

    return dict;
};