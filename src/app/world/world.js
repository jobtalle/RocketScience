/**
 * Simulates physics and behavior for all objects in the same space.
 * @param {Object} myr A Myriad instance.
 * @param {Object} sprites An instantiated Sprites object
 * @param {Number} width The viewport width.
 * @param {Number} height The viewport height.
 * @constructor
 */
export default function World(myr, sprites, width, height) {
    const COLOR_CLEAR = myr.Color.RED;

    const _objects = [];
    const _surface = new myr.Surface(width, height);

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
    };

    /**
     * Render the world.
     */
    this.render = () => {
        _surface.bind();
        _surface.clear();
    };

    /**
     * Draw the world
     */
    this.draw = () => {
        _surface.draw(0, 0);
    };

    _surface.setClearColor(COLOR_CLEAR);
};