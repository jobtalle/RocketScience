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

        this.merge = other => {
            for (let a = 0; a < points.length; ++a) for (let b = 0; b < other.getPoints().length; ++b) {
                if (points[a].equals(other.getPoints()[b])) {
                    const aNext = (a + 1) % points.length;
                    const bPrevious = b - 1 < 0?other.getPoints().length - 1:b - 1;

                    if (points[aNext].equals(other.getPoints()[bPrevious])) {
                        const newPoints = [];

                        for (let i = (b + 1) % other.getPoints().length; i !== bPrevious; i = (i + 1) % other.getPoints().length)
                            newPoints.push(other.getPoints()[i]);

                        if (aNext === 0) {
                            points.splice(0, 1);
                            points.splice(a - 1, 1, ...newPoints);
                        }
                        else
                            points.splice(a, 2, ...newPoints);

                        return true;
                    }
                }
            }

            return false;
        };
    };

    const _parts = [];
    const _center = new Myr.Vector(0, 0);

    const partition = () => {
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
            }
        }

        // Probably factor in part volume here
        _center.divide(_parts.length);

        // Try to merge parts
        let lastPartCount = -1;

        while (lastPartCount !== _parts.length) {
            lastPartCount = _parts.length;

            for (let a = 0; a < _parts.length; ++a) for (let b = a + 1; b < _parts.length; ++b) {
                if (_parts[a].merge(_parts[b])) {
                    _parts.splice(b, 1);

                    break;
                }
            }
        }

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