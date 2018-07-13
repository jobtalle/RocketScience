/**
 * A viewport for the world.
 * @param {Myr} myr A Myriad instance.
 * @param {Number} viewWidth The viewport width in pixels.
 * @param {Number} viewHeight The viewport height in pixels.
 * @constructor
 */
export function View(myr, viewWidth, viewHeight) {
    const ZOOM_MAX = 8;
    const ZOOM_MIN = 0.25;
    const ZOOM_SCALE_FACTOR = 0.25;

    const _transform = new myr.Transform();
    const _inverse = new myr.Transform();
    let _dragging = false;
    let _shiftX = 0;
    let _shiftY = 0;
    let _zoom = 1;
    let _mouseX = 0;
    let _mouseY = 0;

    const updateTransform = () => {
        _transform.identity();
        _transform.translate(viewWidth * 0.5, viewHeight * 0.5);
        _transform.scale(_zoom, _zoom);
        _transform.translate(_shiftX, _shiftY);

        _inverse.set(_transform);
        _inverse.invert();
    };

    const moveView = (x, y) => {
        _shiftX -= x;
        _shiftY -= y;

        updateTransform();
    };

    const zoomShift = zoomPrevious => {
        const scaleFactor = (_zoom - zoomPrevious) / (_zoom * zoomPrevious);

        _shiftX += (viewWidth * 0.5 - _mouseX) * scaleFactor;
        _shiftY += (viewHeight * 0.5 - _mouseY) * scaleFactor;
    };

    /**
     * Returns the X focus.
     * @returns {Number} The X focus.
     */
    this.getFocusX = () => -_shiftX;

    /**
     * Returns the Y focus.
     * @returns {Number} The Y focus.
     */
    this.getFocusY = () => -_shiftY;

    /**
     * Returns the zoom factor.
     * @returns {Number} The zoom factor.
     */
    this.getZoom = () => _zoom;

    /**
     * Return the current transformation this viewport applies.
     * @returns {Myr.Transform} A Myriad transformation.
     */
    this.getTransform = () => _transform;

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
        const zoomPrevious = _zoom;

        _zoom *= 1 + ZOOM_SCALE_FACTOR;
        if (_zoom > ZOOM_MAX)
            _zoom = ZOOM_MAX;

        zoomShift(zoomPrevious);
        updateTransform();
    };

    /**
     * Zoom out.
     */
    this.zoomOut = () => {
        const zoomPrevious = _zoom;

        _zoom *= 1 - ZOOM_SCALE_FACTOR;
        if (_zoom < ZOOM_MIN)
            _zoom = ZOOM_MIN;

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
            const dx = (_mouseX - x) / _zoom;
            const dy = (_mouseY - y) / _zoom;

            if (dx !== 0 || dy !== 0)
                moveView(dx, dy);
        }

        _mouseX = x;
        _mouseY = y;
    };

    /**
     * Focus the view on a specific point.
     * @param {Number} x The x position to focus on.
     * @param {Number} y The y position to focus on.
     * @param {Number} zoom The zoom factor.
     */
    this.focus = (x, y, zoom) => {
        _shiftX = -x;
        _shiftY = -y;
        _zoom = zoom;

        updateTransform();
    };

    updateTransform();
}