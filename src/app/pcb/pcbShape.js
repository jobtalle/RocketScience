import Myr from "../../lib/myr";
import polyDecomp from "poly-decomp"
import {Terrain} from "../world/terrain/terrain";
import {Pcb} from "./pcb";

/**
 * This object builds a minimal collection of convex shapes covering the supplied PCB.
 * @param {Pcb} pcb A PCB.
 * @constructor
 */
export function PcbShape(pcb) {
    const Part = function(points) {
        this.getPoints = () => points;
    };

    Part.prototype.getCenter = function() {
        const center = new Myr.Vector(0, 0);

        for (const point of this.getPoints())
            center.add(point);

        center.divide(this.getPoints().length);

        return center;
    };

    const _parts = [];
    let _center = null;

    const makeHull = () => {
        const points = [];
        const at = new Myr.Vector(0, 0);
        const direction = new Myr.Vector(1, 0);

        while (pcb.getPoint(at.x, at.y) === null)
            ++at.y;

        const origin = at.copy();
        let turned = true;

        while (!at.equals(origin) || points.length === 0) {
            const right = pcb.getPoint(
                at.x + Math.min(0, direction.x) + Math.min(0, -direction.y),
                at.y + Math.min(0, direction.y) + Math.min(0, direction.x));
            const left = pcb.getPoint(
                at.x + Math.min(0, direction.x) + Math.min(0, direction.y),
                at.y + Math.min(0, direction.y) + Math.min(0, -direction.x));

            if (left === null && right !== null)  {
                if (turned) {
                    points.push(at.copy());

                    turned = false;
                }

                at.add(direction);
            }
            else if(left === null) {
                const lastX = direction.x;

                direction.x= -direction.y;
                direction.y = lastX;

                turned = true;
            }
            else {
                const lastY = direction.y;

                direction.y = -direction.x;
                direction.x = lastY;

                turned = true;
            }
        }

        return new Part(points);
    };

    const splitPart = (part, maxPolygons) => {
        if (part.getPoints().length <= maxPolygons)
            return [part];

        const parts = [];

        for (let start = 1; start < part.getPoints().length - 1; start += maxPolygons - 2) {
            const points = [part.getPoints()[0].copy()];

            for (let i = 0; i < maxPolygons - 1 && start + i < part.getPoints().length; ++i)
                points.push(part.getPoints()[start + i].copy());

            parts.push(new Part(points));
        }

        return parts;
    };

    const makeParts = hull => {
        const polygon = [];

        for (const point of hull.getPoints())
            polygon.push([point.x, point.y]);

        const polygons = polyDecomp.quickDecomp(polygon);

        for (const polygon of polygons) {
            const points = [];

            polyDecomp.removeCollinearPoints(polygon, 0.1);

            for (const vertex of polygon)
                points.push(new Myr.Vector(vertex[0], vertex[1]));

            for (const part of splitPart(new Part(points), PcbShape.MAX_VERTICES_PER_POLYGON))
                _parts.push(part);
        }
    };

    const partition = () => {
        const hull = makeHull();

        _center = hull.getCenter();

        makeParts(hull);

        for (const part of _parts)
            for (const point of part.getPoints())
                point.multiply(Terrain.METERS_PER_PIXEL * Pcb.PIXELS_PER_POINT);

        _center.multiply(Terrain.METERS_PER_PIXEL * Pcb.PIXELS_PER_POINT);
    };

    /**
     * Get all parts of this shape.
     * @returns {Array} An array of part objects.
     */
    this.getParts = () => _parts;

    /**
     * Get the center of this shape.
     * @returns {Myr.Vector} The center of this shape.
     */
    this.getCenter = () => _center;

    partition();
}

PcbShape.MAX_VERTICES_PER_POLYGON = 8;