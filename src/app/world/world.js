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

    const _objects = [];
    const _terrain = new Terrain(myr, 100);
    const _surface = new myr.Surface(width, height);
    let _shiftX = 0;
    let _shiftY = 0;
    let _zoom = 1;

    const resetView = () => {
        _shiftX = -_terrain.getWidth() * 0.5;
        _shiftY = 0;
        _zoom = 0.5;
    };

    /**
     * Add a new object to the world.
     * @param {Object} object The object to add.
     */
    this.addObject = object => {
        _objects.push(object);
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