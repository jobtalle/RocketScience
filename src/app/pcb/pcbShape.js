import {Myr} from "../../lib/myr";
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
    };

    const _parts = [];
    const _grid = [];

    const initialize = () => {
        for (let y = 0; y < pcb.getHeight(); ++y) for (let x = 0; x < pcb.getWidth(); ++x) {
            const point = pcb.getPoint(x, y);

            if (point !== null) {
                const part = new Part([
                    new Myr.Vector(
                        x * Terrain.METERS_PER_PIXEL * Pcb.PIXELS_PER_POINT,
                        y * Terrain.METERS_PER_PIXEL * Pcb.PIXELS_PER_POINT),
                    new Myr.Vector(
                        x * Terrain.METERS_PER_PIXEL * Pcb.PIXELS_PER_POINT,
                        (y + 1) * Terrain.METERS_PER_PIXEL * Pcb.PIXELS_PER_POINT),
                    new Myr.Vector(
                        (x + 1) * Terrain.METERS_PER_PIXEL * Pcb.PIXELS_PER_POINT,
                        (y + 1) * Terrain.METERS_PER_PIXEL * Pcb.PIXELS_PER_POINT),
                    new Myr.Vector(
                        (x + 1) * Terrain.METERS_PER_PIXEL * Pcb.PIXELS_PER_POINT,
                        y * Terrain.METERS_PER_PIXEL * Pcb.PIXELS_PER_POINT)]);

                _parts.push(part);
                _grid.push(part);
            }
            else
                _grid.push(null);
        }
    };

    const partition = () => {

    };

    this.getParts = () => _parts;

    initialize();
    partition();
}