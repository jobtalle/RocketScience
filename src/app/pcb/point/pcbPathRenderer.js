import {Scale} from "../../world/scale";
import Myr from "myr.js"

/**
 * A renderer for a PcbPath.
 * @param {PcbPointRenderer} pointRenderer A point renderer to render a paths points with.
 * @constructor
 */
export function PcbPathRenderer(renderContext, pointRenderer) {
    const renderPoint = (x, y, point) => {
        pointRenderer.render(
            point,
            x * Scale.PIXELS_PER_POINT,
            y * Scale.PIXELS_PER_POINT);

        return true;
    };

    /**
     * Render a path.
     * @param {PcbPath} path A PCB path to render.
     */
    this.render = path => {
        if (pointRenderer.getModeColor()) {
            renderContext.getMyr().setColor(pointRenderer.getModeColor());

            path.forPoints(renderPoint);

            renderContext.getMyr().setColor(Myr.Color.WHITE);
        }
        else
            path.forPoints(renderPoint);
    };
}