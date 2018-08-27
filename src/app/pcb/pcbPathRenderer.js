import {Pcb} from "./pcb";

/**
 * A renderer for a PcbPath.
 * @param {PcbPointRenderer} pointRenderer A point renderer to render a paths points with.
 * @constructor
 */
export function PcbPathRenderer(pointRenderer) {
    let _myr = null;

    const renderPoint = (x, y, point) => {
        pointRenderer.render(
            _myr,
            point,
            x * Pcb.PIXELS_PER_POINT,
            y * Pcb.PIXELS_PER_POINT);

        return true;
    };

    /**
     * Render a path.
     * @param {Myr} myr A Myriad instance.
     * @param {PcbPath} path A PCB path to render.
     */
    this.render = (myr, path) => {
        _myr = myr;

        path.forPoints(renderPoint);
    };
}