import * as Myr from "myr.js";
import {Scale} from "../../world/scale";

/**
 * A camera locked to an object. It will always focus directly on that object without delay.
 * @param {Object} view A View instance to control.
 * @param {Object} object An object to follow.
 * @constructor
 */
export function CameraLocked(view, object) {
    const _focus = new Myr.Vector(0, 0);

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
        calculateFocus();

        view.focus(_focus.x, _focus.y, view.getZoom());
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