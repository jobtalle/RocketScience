import {ZoomProfile} from "./zoomProfile"

/**
 * A viewport for the world.
 * @param {Myr} myr A Myriad instance.
 * @param {Number} viewWidth The viewport width in pixels.
 * @param {Number} viewHeight The viewport height in pixels.
 * @param {ZoomProfile} zoomProfile A zoom profile defining zoom behavior.
 * @constructor
 */
export function View(myr, viewWidth, viewHeight, zoomProfile) {
    const _transform = new myr.Transform();
    const _inverse = new myr.Transform();
    const _shift = new myr.Vector(0, 0);
    const _mouse = new myr.Vector(0, 0);

    let _dragging = false;

    const updateTransform = () => {
        _transform.identity();
        _transform.translate(viewWidth * 0.5, viewHeight * 0.5);
        _transform.scale(zoomProfile.getZoom(), zoomProfile.getZoom());
        _transform.translate(_shift.x, _shift.y);

        _inverse.set(_transform);
        _inverse.invert();
    };

    const moveView = (x, y) => {
        _shift.x -= x;
        _shift.y -= y;

        updateTransform();
    };

    const zoomShift = zoomPrevious => {
        const scaleFactor = (zoomProfile.getZoom() - zoomPrevious) / (zoomProfile.getZoom() * zoomPrevious);

        _shift.x += (viewWidth * 0.5 - _mouse.x) * scaleFactor;
        _shift.y += (viewHeight * 0.5 - _mouse.y) * scaleFactor;
    };

    /**
     * Returns the X focus.
     * @returns {Number} The X focus.
     */
    this.getFocusX = () => -_shift.x;

    /**
     * Returns the Y focus.
     * @returns {Number} The Y focus.
     */
    this.getFocusY = () => -_shift.y;

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
        updateTransform();
    };

    /**
     * Zoom out.
     */
    this.zoomOut = () => {
        const zoomPrevious = zoomProfile.getZoom();

        zoomProfile.zoomOut();

        zoomShift(zoomPrevious);
        updateTransform();
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
        _shift.x = -x;
        _shift.y = -y;

        zoomProfile.setZoom(zoom);

        updateTransform();
    };

    updateTransform();
}