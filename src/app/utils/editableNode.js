import * as Myr from "myr.js";
import {EditableRegion} from "../mission/editable/editableRegion";

/**
 *
 * @param {Myr.Vector} sourceOrigin
 * @param {EditableRegion} region
 * @constructor
 */
export function EditableNode(sourceOrigin, region) {
    const _diff = sourceOrigin.copy();
    _diff.subtract(region.getOrigin());
    const _dist = _diff.length();

    this.getPrio = () => _dist;

    this.getRegion = () => region;
}

/**
 * Basic priority queue. Implements push and pop functionality. Nodes must have a "getPrio" function for sorting.
 * Lowest priority values are popped first.
 * @constructor
 */
export function PriorityQueue() {
    const _queue = [];

    this.push = node => {
        _queue.push(node);
        _queue.sort(((a, b) => {
            if (a.getPrio() > b.getPrio())
                return -1;

            if (a.getPrio() < b.getPrio())
                return 1;

            return 0;
        }));
    };

    this.pop = () => _queue.pop();

    this.isEmpty = () => _queue.length === 0;
}

/**
 * Returns a vector for the valid origin of an editable.
 * @param editable
 * @param editables
 * @returns {Myr.Vector}
 */
export function getValidOrigin(editable, editables) {
    const _visited = [];
    const _queue = new PriorityQueue();
    const _sourceOrigin = editable.getRegion().getOrigin().copy();

    _queue.push(new EditableNode(_sourceOrigin, editable.getRegion().copy()));

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
            let illegal = false;

            for (const visitedOrigin of _visited) {
                if (newRegion.getOrigin().x === visitedOrigin.x && newRegion.getOrigin().y === visitedOrigin.y) {
                    illegal = true;

                    break;
                }
            }

            if (!illegal) {
                _queue.push(new EditableNode(_sourceOrigin, newRegion));
                _visited.push(newRegion.getOrigin());
            }
        }
    }
    console.log("ERROR: NO VALID PATH FOUND");
}