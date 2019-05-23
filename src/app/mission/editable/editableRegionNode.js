/**
 * A node for use in the PriorityQueue.
 * @param {Myr.Vector} sourceOrigin
 * @param {EditableRegion} region
 * @constructor
 */
export function EditableRegionNode(sourceOrigin, region) {
    const _diff = sourceOrigin.copy();
    _diff.subtract(region.getOrigin());
    const _dist = _diff.length();

    this.getPrio = () => _dist;

    this.getRegion = () => region;
}