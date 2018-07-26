import Myr from "../../lib/myr";
import {Terrain} from "../world/terrain";
import {Pcb} from "./pcb";

/**
 * This object builds a minimal collection of convex shapes covering the supplied PCB.
 * @param {Pcb} pcb A PCB.
 * @constructor
 */
export function PcbShape(pcb) {
    const Part = function(points) {
        this.getPoints = () => points;

        this.getCenter = () => {
            const center = new Myr.Vector(0, 0);

            for (const point of points)
                center.add(point);

            center.divide(points.length);

            return center;
        };
    };

    const _parts = [];
    let _center = null;

    const getHull = () => {
        const at = new Myr.Vector(0, -1);
        const direction = new Myr.Vector(0, 1);
        const edge = new Myr.Vector(1, 0);
        const points = [];

        let startPoint = null;

        const turnCcw = vector => {
            const lastY = vector.y;

            vector.y = -vector.x;
            vector.x = lastY;
        };

        const turnCw = vector => {
            const lastX = vector.x;

            vector.x = -vector.y;
            vector.y = lastX;
        };

        const push = () => points.push(new Myr.Vector(at.x + 0.5, at.y + 0.5));

        while (true) {
            if (pcb.getPoint(at.x + edge.x, at.y + edge.y) === null && startPoint !== null) {
                turnCcw(direction);
                turnCcw(edge);

                at.add(direction);

                push();
            }
            else if (pcb.getPoint(at.x + direction.x, at.y + direction.y) !== null) {
                if (startPoint === null)
                    startPoint = at.copy();

                turnCw(direction);
                turnCw(edge);

                push();
            }
            else {
                at.add(direction);

                if (startPoint === null)
                    continue;

                push();

                if (at.equals(startPoint))
                    break;
            }
        }

        return new Part(points);
    };

    const partition = () => {
        const hull = getHull();

        // Debug view
        _parts.push(hull);

        // Probably factor in part volume here
        _center = hull.getCenter();

        // Decompose hull into convex parts
        // TODO

        // Convert to meters
        for (const part of _parts)
            for (const point of part.getPoints())
                point.multiply(Terrain.METERS_PER_PIXEL * Pcb.PIXELS_PER_POINT);

        _center.multiply(Terrain.METERS_PER_PIXEL * Pcb.PIXELS_PER_POINT);
    };

    this.getParts = () => _parts;
    this.getCenter = () => _center;

    partition();
}