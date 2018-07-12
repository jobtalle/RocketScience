import {Terrain} from "./terrain";
import {View} from "./view";
import {Physics} from "./physics";

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
    const GRAVITY = 9.81;

    const _objects = [];
    const _physics = new Physics(GRAVITY);
    const _terrain = new Terrain(myr, 100);
    const _surface = new myr.Surface(width, height);
    const _view = new View(myr, _terrain.getWidth(), _terrain.getHeight(), width, height);

    let _paused = false;

    /**
     * Focus the view on a specific point.
     * @param {Number} x The x position to focus on in meters.
     * @param {Number} y The y position to focus on in meters.
     * @param {Number} zoom The zoom factor.
     */
    this.focus = (x, y, zoom) => {
        _view.focus(
            x * Terrain.PIXELS_PER_METER,
            y * Terrain.PIXELS_PER_METER,
            zoom);
    };

    /**
     * Add a new object to the world.
     * @param {Object} object The object to add.
     */
    this.addObject = object => {
        _objects.push(object);
    };

    /**
     * Press the mouse.
     */
    this.onMousePress = () => {
        _view.onMousePress();
    };

    /**
     * Release the mouse.
     */
    this.onMouseRelease = () => {
        _view.onMouseRelease();
    };

    /**
     * Move the mouse.
     * @param {Number} x The mouse x position in pixels.
     * @param {Number} y The mouse y position in pixels.
     */
    this.onMouseMove = (x, y) => {
        _view.onMouseMove(x, y);
    };

    /**
     * Zoom in.
     */
    this.zoomIn = () => {
        _view.zoomIn();
    };

    /**
     * Zoom out.
     */
    this.zoomOut = () => {
        _view.zoomOut();
    };

    /**
     * Pause the world.
     */
    this.pause = () => {
        _paused = true;
    };

    /**
     * Unpause the world.
     */
    this.unpause = () => {
        _paused = false;
    };

    /**
     * Update the state of the world.
     * @param {Number} timeStep The number of seconds passed after the previous update.
     */
    this.update = timeStep => {
        if (!_paused)
            _physics.update(timeStep);

        for (let index = 0; index < _objects.length; index++)
            _objects[index].update(timeStep);

        _surface.bind();
        _surface.clear();

        myr.push();
        myr.transform(_view.getTransform());

        _terrain.draw();
        _physics.draw(myr);

        myr.pop();
    };

    /**
     * Draw the world
     */
    this.draw = () => {
        _surface.draw(0, 0);
    };

    _surface.setClearColor(COLOR_CLEAR);
    _terrain.makeTerrain(_physics);
}