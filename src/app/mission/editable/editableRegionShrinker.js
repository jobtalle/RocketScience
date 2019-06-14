import {EditableRegionResizeNode} from "./editableRegionResizeNode";
import {PriorityQueue} from "../../utils/priorityQueue";
import {EditableRegion} from "./editableRegion";
import {Scale} from "../../world/scale";

/**
 * Returns a valid region for an editable.
 * @param {Editable} editable Current editable, of which the origin might be invalid.
 * @param {Array} editables List of all editables in the world.
 * @returns {EditableRegion} Valid editable region.
 */
export function getValidRegion(editable, editables) {
    const _queue = new PriorityQueue();
    const _sourceRegion = editable.getRegion().copy();

    _queue.push(new EditableRegionResizeNode(_sourceRegion, editable.getRegion().copy()));

    while (!_queue.isEmpty()) {
        const node = _queue.pop();
        const region = node.getRegion();
        let intersected = false;

        for (const otherEditable of editables) {
            if (otherEditable === editable)
                continue;

            if (otherEditable.getRegion().intersectsRegion(region)) {
                intersected = true;

                if (editable.getPosition().x > otherEditable.getRegion().getOrigin().x + otherEditable.getRegion().getSize().x) {
                    const regionCopy = region.copy();
                    const dx = otherEditable.getRegion().getOrigin().x + otherEditable.getRegion().getSize().x - regionCopy.getOrigin().x;
                    regionCopy.moveOrigin(dx, 0);
                    regionCopy.resize(-dx, 0);

                    _queue.push(new EditableRegionResizeNode(_sourceRegion, regionCopy));
                }
                if (editable.getPosition().y > otherEditable.getRegion().getOrigin().y + otherEditable.getRegion().getSize().y) {
                    const regionCopy = region.copy();
                    const dy = otherEditable.getRegion().getOrigin().y + otherEditable.getRegion().getSize().y - regionCopy.getOrigin().y;
                    regionCopy.moveOrigin(0,dy);
                    regionCopy.resize(0, -dy);

                    _queue.push(new EditableRegionResizeNode(_sourceRegion, regionCopy));
                }
                if (editable.getPosition().x + editable.getPcb().getWidth() * Scale.METERS_PER_POINT < otherEditable.getRegion().getOrigin().x) {
                    const regionCopy = region.copy();
                    const dx = regionCopy.getOrigin().x + regionCopy.getSize().x - otherEditable.getRegion().getOrigin().x;
                    regionCopy.resize(-dx, 0);

                    _queue.push(new EditableRegionResizeNode(_sourceRegion, regionCopy));
                }
                if (editable.getPosition().y + editable.getPcb().getHeight() * Scale.METERS_PER_POINT < otherEditable.getRegion().getOrigin().y) {
                    const regionCopy = region.copy();
                    const dy = regionCopy.getOrigin().y + regionCopy.getSize().y - otherEditable.getRegion().getOrigin().y;
                    regionCopy.resize(0, -dy);

                    _queue.push(new EditableRegionResizeNode(_sourceRegion, regionCopy));
                }
            }
        }

        if (intersected === false)
            return region;

    }
}