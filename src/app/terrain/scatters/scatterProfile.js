/**
 * A profile according to which scatters are placed.
 * Different profiles can produce different graphical themes.
 * @param {Array} entries An array of ScatterProfile.Entry objects.
 * @constructor
 */
export function ScatterProfile(entries) {
    /**
     * Get all entries contained in this scatter profile.
     * @returns {Array} An array containing all entries.
     */
    this.getEntries = () => entries;
}

/**
 * An entry to add to the scattering process.
 * @param {Number} type A valid scatter profile type.
 * @param {Number} interval The interval between instances in sprite widths.
 * @param {Number} threshold A percentage of the terrain to cover with this entry in the range [0, 1].
 * @param {Number} maxSlope The maximum slope this entry will be placed at.
 */
ScatterProfile.Entry = function(type, interval, threshold, maxSlope) {
    this.spriteName = type;
    this.interval = interval;
    this.threshold = threshold;
    this.maxSlope = maxSlope;
};

ScatterProfile.TYPE_ROCKS = "rocks";