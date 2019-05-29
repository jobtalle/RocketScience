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

    this.getPrio = () => _dist;

    this.getRegion = () => region;
}

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

    this.getPrio = () => _dist;

    this.getRegion = () => region;
}