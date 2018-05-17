/**
 * Simulates physics and behavior for all objects in the same space.
 * @constructor
 */
export default function World() {
    const _objects = [];

    /**
     * Add a new object to the world.
     * @param {Object} object The object to add.
     */
    this.addObject = object => {
        _objects.push(object);
    };

    /**
     * Update the state of the world.
     * @param {Number} timeStep The number of milliseconds passed after the previous update.
     */
    this.update = timeStep => {
        for (let index = 0; index < _objects.length; index++)
            _objects[index].update(timeStep);
    };
};