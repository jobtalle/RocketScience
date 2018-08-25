/**
 * A path of connected PBC points on a PCB.
 * @param {Pcb} pcb A PCB.
 * @param {Number} x The X location to start tracing a path from.
 * @param {Number} y The Y location to start tracing a path from.
 * @constructor
 */
import * as Myr from "../../lib/myr";

export function PcbPath(pcb, x, y) {
    const _points = [];
    const _path = [];

    const trace = () => {
        const addPoint = (x, y, exclude) => {
            const point = pcb.getPoint(x, y);

            if (!point || _points.indexOf(point) !== -1)
                return;

            _points.push(point);
            _path.push(new Myr.Vector(x, y));

            point.withConnected((dx, dy, direction) => {
                addPoint(x + dx, y + dy, direction);
            }, exclude);
        };

        addPoint(x, y);
    };

    /**
     * Get the PCB points connected to the starting point.
     * @returns {Array} An array of PCB points.
     */
    this.getPoints = () => _points;

    /**
     * Get an array of coordinates matching the array returned from getPoints.
     * @returns {Array} An array of Myr.Vector points.
     */
    this.getPath = () => _path;

    trace();
}