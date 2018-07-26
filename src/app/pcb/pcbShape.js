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
        const points = [];
        const at = new Myr.Vector(0, 0);
        const direction = new Myr.Vector(1, 0);

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

        while (pcb.getPoint(at.x, at.y) === null)
            ++at.y;

        const origin = at.copy();

        while (!at.equals(origin) || points.length === 0) {
            let left, right;

            if (direction.x === 1) {
                // Right
                left = pcb.getPoint(at.x, at.y - 1);
                right = pcb.getPoint(at.x, at.y);
            }
            else if (direction.x === -1) {
                // Left
                left = pcb.getPoint(at.x - 1, at.y);
                right = pcb.getPoint(at.x - 1, at.y - 1);
            }
            else if (direction.y === -1) {
                // Up
                left = pcb.getPoint(at.x - 1, at.y - 1);
                right = pcb.getPoint(at.x, at.y - 1);
            }
            else {
                // Down
                left = pcb.getPoint(at.x, at.y);
                right = pcb.getPoint(at.x - 1, at.y);
            }

            if ((left !== null && right === null) || (left === null && right !== null)) {
                points.push(at.copy());

                at.add(direction);
            }
            else if(left === null)
                turnCw(direction);
            else
                turnCcw(direction);
        }
        console.log(points);
        return new Part(points);
    };

    const makeParts = hull => {
        const polygon = [];

        for (let i = hull.getPoints().length; i-- > 0;)
            polygon.push([hull.getPoints()[i].x, hull.getPoints()[i].y]);

        polyDecomp.removeCollinearPoints(polygon, 0.1);

        const polygons = polyDecomp.quickDecomp(polygon);

        for (const polygon of polygons) {
            const points = [];

            for (const vertex of polygon)
                points.push(new Myr.Vector(vertex[0], vertex[1]));

            //_parts.push(new Part(points));
        }
    };

    const partition = () => {
        const hull = makeHull();
        _parts.push(hull);
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