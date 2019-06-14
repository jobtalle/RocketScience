/**
 * A node for use in the PriorityQueue.
 * @param {Myr.Vector} sourceOrigin
 * @param {EditableRegion} region
 * @constructor
 */
export function EditableRegionMoveNode(sourceOrigin, region) {
    const _diff = sourceOrigin.copy();
    _diff.subtract(region.getOrigin());
    const _dist = _diff.length();

    /**
     * Get the priority value of this node.
     * @returns {number}
     */
    this.getPrio = () => _dist;

    /**
     * Get the region of this node.
     * @returns {EditableRegion}
     */
    this.getRegion = () => region;
}
