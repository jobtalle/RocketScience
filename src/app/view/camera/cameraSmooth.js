import * as Myr from "myr.js";
import {Scale} from "../../world/scale";
import {QuadraticApproach} from "../../utils/quadraticApproach";

/**
 * A smooth camera locked to an object. The focus object will always be within the viewport.
 * @param {Object} view A View instance to control.
 * @param {Array} objects An array of WorldObject instances to follow.
 * @constructor
 */
export function CameraSmooth(view, objects) {
    const _focus = new Myr.Vector(0, 0);
    const _x = new QuadraticApproach(0, 0, -1000, 1000);
    const _y = new QuadraticApproach(0, 0, -1000, 1000);

    /**
     * Update the camera.
     * @param {Number} timeStep The number of seconds passed after the previous update.
     */
    this.update = timeStep => {
        const vector = new Myr.Vector(0, 0);

        _focus.x = _focus.y = 0;

        for (const object of objects) {
            vector.x = object.getPcb().getWidth() * Scale.PIXELS_PER_POINT * 0.5;
            vector.y = object.getPcb().getHeight() * Scale.PIXELS_PER_POINT * 0.5;

            object.getTransform().apply(vector);

            _focus.add(vector);
        }

        _focus.divide(objects.length);
        _x.setTarget(_focus.x);
        _y.setTarget(_focus.y);

        _x.update(timeStep);
        _y.update(timeStep);

        view.focus(_x.getValue(), _y.getValue(), view.getZoom());
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