/**
 * The part summary is used to count the number of times each part is used.
 * @param {Pcb} [pcb] A pcb to create the summary from. If undefined, the user can create a summary manually.
 * @constructor
 */
export function PartSummary(pcb) {
    const _entries = {};

    const build = () => {
        if (!pcb)
            return;

        for (const fixture of pcb.getFixtures()) if (fixture.part)
            this.register(fixture.part.getDefinition().object);
    };

    /**
     * Count the number of parts with a given name.
     * @param {String} name A part name to look for.
     * @returns {Number} The number of occurrences.
     */
    this.getPartCount = name => {
        if (_entries[name] === undefined)
            return 0;

        return _entries[name];
    };

    /**
     * Get this summary's entries.
     * @returns {Array} An array of entries.
     */
    this.getEntries = () => _entries;

    /**
     * Add a part to the summary.
     * @param {String} name The name of the part.
     */
    this.register = name => {
        if (_entries[name] === undefined)
            _entries[name] = 1;
        else
            ++_entries[name];
    };

    /**
     * Merge this summary with another summary.
     * @param {PartSummary} summary Another summary.
     */
    this.merge = summary => {
        for (const key of Object.keys(summary.getEntries())) {
            if (_entries[key] === undefined)
                _entries[key] = summary.getEntries()[key];
            else
                _entries[key] += summary.getEntries()[key];
        }
    };

    build();
}