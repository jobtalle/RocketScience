import {ZoomProfile} from "./zoomProfile";
import {ShiftProfile} from "./shiftProfile";
import Myr from "myr.js"

/**
 * A viewport for the world.
 * @param {Number} viewWidth The viewport width in pixels.
 * @param {Number} viewHeight The viewport height in pixels.
 * @param {ZoomProfile} zoomProfile A zoom profile defining zoom led.
 * @param {ShiftProfile} shiftProfile A shift profile defining shift led.
 * @constructor
 */
export function View(viewWidth, viewHeight, zoomProfile, shiftProfile) {
    const _transform = new Myr.Transform();
    const _inverse = new Myr.Transform();
    const _mouse = new Myr.Vector(0, 0);
    const _origin = new Myr.Vector(0, 0);
    const _size = new Myr.Vector(0, 0);

    let _onChanged = null;
    let _dragging = false;

    const updateTransform = () => {
        _transform.identity();
        _transform.translate(Math.round(viewWidth * 0.5), Math.round(viewHeight * 0.5));
        _transform.scale(zoomProfile.getZoom(), zoomProfile.getZoom());
        _transform.translate(shiftProfile.getShift().x, shiftProfile.getShift().y);

        _inverse.set(_transform);
        _inverse.invert();

        _size.x = viewWidth / this.getZoom();
        _size.y = viewHeight / this.getZoom();
        _origin.x = this.getFocusX() - _size.x * 0.5;
        _origin.y = this.getFocusY() - _size.y * 0.5;

        if (_onChanged)
            _onChanged();
    };

    const moveView = (x, y) => {
        shiftProfile.shift(-x, -y, zoomProfile.getZoom());

        updateTransform();
    };

    const zoomShift = zoomPrevious => {
        const scaleFactor = (zoomProfile.getZoom() - zoomPrevious) / (zoomProfile.getZoom() * zoomPrevious);

        moveView(
            (_mouse.x - viewWidth * 0.5) * scaleFactor,
            (_mouse.y - viewHeight * 0.5) * scaleFactor);
    };

    /**
     * Get the view origin in meters, which is the top left origin in meters.
     * @returns {Myr.Vector} The origin in meters.
     */
    this.getOrigin = () => _origin;

    /**
     * Get the size the view spans in meters.
     * @returns {Myr.Vector} The dimensions in meters.
     */
    this.getSize = () => _size;

    /**
     * Get the view width.
     * @returns {Number} The view width in pixels.
     */
    this.getWidth = () => viewWidth;

    /**
     * Get the view height.
     * @returns {Number} The view height in pixels.
     */
    this.getHeight = () => viewHeight;

    /**
     * Specify a function that should be executed whenever the view changes.
     * @param {Function} f A function.
     */
    this.setOnChanged = f => {
        _onChanged = f;
    };

    /**
     * Returns the X focus.
     * @returns {Number} The X focus.
     */
    this.getFocusX = () => -shiftProfile.getShift().x;

    /**
     * Returns the Y focus.
     * @returns {Number} The Y focus.
     */
    this.getFocusY = () => -shiftProfile.getShift().y;

    /**
     * Returns the zoom factor.
     * @returns {Number} The zoom factor.
     */
    this.getZoom = () => zoomProfile.getZoom();

    /**
     * Return the current transformation this viewport applies.
     * @returns {Myr.Transform} A Myriad transformation.
     */
    this.getTransform = () => _transform;

    /**
     * Return the last mouse location known by this view.
     * @returns {Myr.Vector} A Myriad vector.
     */
    this.getMouse = () => _mouse;

    /**
     * Returns whether the view is currently being moved.
     * @returns {Boolean} A boolean indicating whether the view is being moved.
     */
    this.isDragging = () => _dragging;

    /**
     * Returns the current inverse transformation this viewport applies.
     * @returns {Myr.Transform} A Myriad transformation.
     */
    this.getInverse = () => _inverse;

    /**
     * Zoom in.
     */
    this.zoomIn = () => {
        const zoomPrevious = zoomProfile.getZoom();

        zoomProfile.zoomIn();

        zoomShift(zoomPrevious);
    };

    /**
     * Zoom out.
     */
    this.zoomOut = () => {
        const zoomPrevious = zoomProfile.getZoom();

        zoomProfile.zoomOut();

        zoomShift(zoomPrevious);
    };

    /**
     * Press the mouse.
     */
    this.onMousePress = () => {
        _dragging = true;
    };

    /**
     * Release the mouse.
     */
    this.onMouseRelease = () => {
        _dragging = false;
    };

    /**
     * Move the mouse.
     * @param {Number} x The mouse x position in pixels.
     * @param {Number} y The mouse y position in pixels.
     */
    this.onMouseMove = (x, y) => {
        if (_dragging) {
            const dx = (_mouse.x - x) / zoomProfile.getZoom();
            const dy = (_mouse.y - y) / zoomProfile.getZoom();

            if (dx !== 0 || dy !== 0)
                moveView(dx, dy);
        }

        _mouse.x = x;
        _mouse.y = y;
    };

    /**
     * Focus the view on a specific point.
     * @param {Number} x The x position to focus on.
     * @param {Number} y The y position to focus on.
     * @param {Number} zoom The zoom factor.
     */
    this.focus = (x, y, zoom) => {
        shiftProfile.setShift(-x, -y, zoom);
        zoomProfile.setZoom(zoom);

        updateTransform();
    };

    /**
     * Resize the view.
     * @param {Number} width The width in pixels.
     * @param {Number} height The height in pixels.
     */
    this.resize = (width, height) => {
        viewWidth = width;
        viewHeight = height;

        updateTransform();
    };

    updateTransform();
}