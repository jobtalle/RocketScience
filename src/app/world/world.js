import {Terrain} from "./terrain";

/**
 * Simulates physics and behavior for all objects in the same space.
 * @param {Object} myr A Myriad instance.
 * @param {Object} sprites An instantiated Sprites object
 * @param {Number} width The viewport width.
 * @param {Number} height The viewport height.
 * @constructor
 */
export function World(myr, sprites, width, height) {
    const COLOR_CLEAR = new myr.Color(0.5, 0.6, 0.7);
    const SCALE_FACTOR = 0.25;
    const ZOOM_MAX = 8;
    const ZOOM_MIN = 0.25;

    const _objects = [];
    const _terrain = new Terrain(myr, 100);
    const _surface = new myr.Surface(width, height);
    let _shiftX = 0;
    let _shiftY = 0;
    let _zoom = 1;
    let _mouseX = -1;
    let _mouseY = -1;

    const resetView = () => {
        _shiftX = -_terrain.getWidth() * 0.5;
        _shiftY = 0;
        _zoom = 0.5;
    };

    const zoomShift = zoomPrevious => {
        const scaleFactor = (_zoom - zoomPrevious) / (_zoom * zoomPrevious);

        _shiftX += (width * 0.5 - _mouseX) * scaleFactor;
        _shiftY += (height * 0.5 - _mouseY) * scaleFactor;
    };

    /**
     * Add a new object to the world.
     * @param {Object} object The object to add.
     */
    this.addObject = object => {
        _objects.push(object);
    };

    /**
     * Move the mouse.
     * @param {Number} x The mouse x position in pixels.
     * @param {Number} y The mouse y position in pixels.
     */
    this.onMouseMove = (x, y) => {
        _mouseX = x;
        _mouseY = y;
    };

    /**
     * Zoom in.
     */
    this.zoomIn = () => {
        const zoomPrevious = _zoom;

        _zoom *= 1 + SCALE_FACTOR;
        if (_zoom > ZOOM_MAX)
            _zoom = ZOOM_MAX;

        zoomShift(zoomPrevious);
    };

    /**
     * Zoom out.
     */
    this.zoomOut = () => {
        const zoomPrevious = _zoom;

        _zoom *= 1 - SCALE_FACTOR;
        if (_zoom < ZOOM_MIN)
            _zoom = ZOOM_MIN;

        zoomShift(zoomPrevious);
    };

    /**
     * Update the state of the world.
     * @param {Number} timeStep The number of seconds passed after the previous update.
     */
    this.update = timeStep => {
        for (let index = 0; index < _objects.length; index++)
            _objects[index].update(timeStep);

        _surface.bind();
        _surface.clear();

        myr.push();
        myr.translate(width * 0.5, height * 0.5);
        myr.scale(_zoom, _zoom);
        myr.translate(_shiftX, _shiftY);

        _terrain.draw();

        myr.pop();
    };

    /**
     * Draw the world
     */
    this.draw = () => {
        _surface.draw(0, 0);
    };

    _surface.setClearColor(COLOR_CLEAR);

    resetView();
}