import * as Myr from "myr.js";
import {Scale} from "../../world/scale";
import {ExponentialApproach} from "../../utils/exponentialApproach";

/**
 * A smooth camera locked to an object. The focus object will always be within the viewport.
 * @param {Object} view A View instance to control.
 * @param {Object} object An object to follow.
 * @constructor
 */
export function CameraSmooth(view, object) {
    const _focus = new Myr.Vector(view.getFocusX(), view.getFocusY());
    const _x = new ExponentialApproach(0, 0, CameraSmooth.RATE);
    const _y = new ExponentialApproach(0, 0, CameraSmooth.RATE);

    const calculateFocus = () => {
        _focus.x = object.getPcb().getWidth() * Scale.PIXELS_PER_POINT * 0.5;
        _focus.y = object.getPcb().getHeight() * Scale.PIXELS_PER_POINT * 0.5;

        object.getTransform().apply(_focus);
    };

    /**
     * Update the camera.
     * @param {Number} timeStep The number of seconds passed after the previous update.
     */
    this.update = timeStep => {
        const xp = _focus.x;
        const yp = _focus.y;
        const xd = (view.getWidth() * 0.5 - CameraSmooth.BORDER) / view.getZoom();
        const yd = (view.getHeight() * 0.5 - CameraSmooth.BORDER) / view.getZoom();

        calculateFocus();

        let xv = _x.getValue() - (_focus.x - xp);
        let yv = _y.getValue() - (_focus.y - yp);

        if (xv < -xd)
            xv = -xd;
        else if (xv > xd)
            xv = xd;

        if (yv < -yd)
            yv = -yd;
        else if (yv > yd)
            yv = yd;

        _x.setValue(xv);
        _y.setValue(yv);

        view.focus(_focus.x + _x.getValue(), _focus.y + _y.getValue(), view.getZoom());

        _x.update(timeStep);
        _y.update(timeStep);
    };

    /**
     * Zoom in.
     */
    this.zoomIn = () => {
        view.zoomIn();
    };

    /**
     * Zoom out.
     */
    this.zoomOut = () => {
        view.zoomOut();
    };

    /**
     * Press the mouse.
     */
    this.onMousePress = () => {

    };

    /**
     * Release the mouse.
     */
    this.onMouseRelease = () => {

    };

    /**
     * Move the mouse.
     * @param {Number} x The mouse x position in pixels.
     * @param {Number} y The mouse y position in pixels.
     */
    this.onMouseMove = (x, y) => {

    };
}

CameraSmooth.RATE = 0.005;
CameraSmooth.BORDER = 100;