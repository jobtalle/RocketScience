/**
 * A node for use in the PriorityQueue.
 * @param {EditableRegion} sourceRegion
 * @param {EditableRegion} region
 * @constructor
 */
export function EditableRegionResizeNode(sourceRegion, region) {
    const sourceOrigin = sourceRegion.getOrigin();
    const sourceSize = sourceRegion.getSize();

    const _originDiff = sourceOrigin.copy();
    _originDiff.subtract(region.getOrigin());

    const _sizeDiff = sourceSize.copy();
    _sizeDiff.add(sourceRegion.getOrigin());
    _sizeDiff.subtract(region.getOrigin());
    _sizeDiff.subtract(region.getSize());

    const _dist = _originDiff.length() + _sizeDiff.length();

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
