import Myr from "../../lib/myr";
import polyDecomp from "poly-decomp"
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

    const makeHull = () => {
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

        const push = point => {
            if (points.length === 0 || (!points[points.length - 1].equals(point) && !points[0].equals(point)))
                points.push(point);
        };

        while (true) {
            if (pcb.getPoint(at.x + edge.x, at.y + edge.y) === null && startPoint !== null) {
                if (direction.x === -1 || direction.y === -1)
                    points.pop();

                turnCcw(direction);
                turnCcw(edge);

                at.add(direction);
            }
            else if (pcb.getPoint(at.x + direction.x, at.y + direction.y) !== null) {
                if (startPoint === null)
                    startPoint = at.copy();

                if (direction.x === 0 && direction.y === 1)
                    push(new Myr.Vector(at.x + 1, at.y + 1));

                turnCw(direction);
                turnCw(edge);
            }
            else
                at.add(direction);

            if (startPoint !== null) {
                if (points.length > 1 && at.equals(startPoint))
                    break;

                push(new Myr.Vector(at.x + Math.max(0, edge.x), at.y + Math.max(0, edge.y)));
            }
        }

        return new Part(points);
    };

    const makeParts = hull => {
        const polygon = [];

        for (const point of hull.getPoints())
            polygon.push([point.x, point.y]);

        polyDecomp.makeCCW(polygon);
        polyDecomp.removeCollinearPoints(polygon, 0.1);

        const polygons = polyDecomp.quickDecomp(polygon);

        for (const polygon of polygons) {
            const points = [];

            for (const vertex of polygon)
                points.push(new Myr.Vector(vertex[0], vertex[1]));

            _parts.push(new Part(points));
        }
    };

    const partition = () => {
        const hull = makeHull();

        // Probably factor in part volume here
        _center = hull.getCenter();

        // Decompose hull into convex parts
        makeParts(hull);

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