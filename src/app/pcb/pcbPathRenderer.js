import {Pcb} from "./pcb";

/**
 * A renderer for a PcbPath.
 * @param {PcbPointRenderer} pointRenderer A point renderer to render a paths points with.
 * @constructor
 */
export function PcbPathRenderer(pointRenderer) {
    const renderPoint = (x, y, point) => pointRenderer.render(
        point,
        x * Pcb.PIXELS_PER_POINT,
        y * Pcb.PIXELS_PER_POINT);

    /**
     * Render a path.
     * @param {PcbPath} path A PCB path to render.
     */
    this.render = path => path.forPoints(renderPoint);
}