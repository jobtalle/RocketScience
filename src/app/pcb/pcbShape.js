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
    const _center = new Myr.Vector(0, 0);

    const partition = () => {
        const _grid = [];

        for (let y = 0; y < pcb.getHeight(); ++y) for (let x = 0; x < pcb.getWidth(); ++x) {
            const point = pcb.getPoint(x, y);

            if (point !== null) {
                const part = new Part([
                    new Myr.Vector(x, y),
                    new Myr.Vector(x, y + 1),
                    new Myr.Vector(x + 1, y + 1),
                    new Myr.Vector(x + 1, y)
                ]);

                _center.add(part.getCenter());

                _parts.push(part);
                _grid.push(part);
            }
            else
                _grid.push(null);
        }

        // Possibly factor in part volume here
        _center.divide(_parts.length);

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