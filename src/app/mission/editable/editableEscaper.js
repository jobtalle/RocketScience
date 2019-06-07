import {EditableRegionMoveNode} from "./editableRegionMoveNode";
import {PriorityQueue} from "../../utils/priorityQueue";
import {EditableRegion} from "./editableRegion";
import * as Myr from "myr.js";

/**
 * Returns a vector for the valid origin of an editable.
 * @param {Editable} editable Current editable, of which the origin might be invalid.
 * @param {Array} editables List of all editables in the world.
 * @returns {Myr.Vector} Valid coordinates for the origin of the editable.
 */
export function getValidOrigin(editable, editables) {
    const _visited = [];
    const _queue = new PriorityQueue();
    const _sourceOrigin = editable.getRegion().getOrigin().copy();

    _queue.push(new EditableRegionMoveNode(_sourceOrigin, editable.getRegion().copy()));

    while (!_queue.isEmpty()) {
        const node = _queue.pop();
        const region = node.getRegion();
        let intersected = undefined;

        for (const otherEditable of editables) {
            if (otherEditable === editable)
                continue;

            if (otherEditable.getRegion().intersectsRegion(region)) {
                intersected = otherEditable;

                break;
            }
        }

        if (intersected === undefined)
            return region.getOrigin();

        const newRegions = [];

        newRegions.push(new EditableRegion(new Myr.Vector(region.getOrigin().x, intersected.getRegion().getOrigin().y + intersected.getRegion().getSize().y), region.getSize()));
        newRegions.push(new EditableRegion(new Myr.Vector(intersected.getRegion().getOrigin().x + intersected.getRegion().getSize().x, region.getOrigin().y), region.getSize()));
        newRegions.push(new EditableRegion(new Myr.Vector(region.getOrigin().x, intersected.getRegion().getOrigin().y - region.getSize().y), region.getSize()));
        newRegions.push(new EditableRegion(new Myr.Vector(intersected.getRegion().getOrigin().x - region.getSize().x, region.getOrigin().y), region.getSize()));

        for (const newRegion of newRegions) {
            let unvisited = true;

            for (const visitedOrigin of _visited) {
                if (newRegion.getOrigin().x === visitedOrigin.x && newRegion.getOrigin().y === visitedOrigin.y) {
                    unvisited = false;

                    break;
                }
            }

            if (unvisited) {
                _queue.push(new EditableRegionMoveNode(_sourceOrigin, newRegion));
                _visited.push(newRegion.getOrigin());
            }
        }
    }
}