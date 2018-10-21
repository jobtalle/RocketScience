/**
 * The part summary is used to count the number of times each part is used.
 * @param {Pcb} pcb A pcb to create the summary from.
 * @constructor
 */
export function PartSummary(pcb) {
    const entries = {};

    const build = () => {
        for (const fixture of pcb.getFixtures()) if (fixture.part) {
            const name = fixture.part.getDefinition().name;

            if (entries[name] === undefined)
                entries[name] = 1;
            else
                ++entries[name];
        }
    };

    /**
     * Count the number of parts with a given name.
     * @param {String} name A part name to look for.
     * @returns {Number} The number of occurrences.
     */
    this.getPartCount = name => {
        if (entries[name] === undefined)
            return 0;

        return entries[name];
    };

    build();
}