/**
 * A mission consists of one or multiple objectives.
 * @param {Array} objectives All objectives required to complete this mission.
 * @param {Array} editables An array of editables. The first editable will be the default pcb.
 * @param {PhysicsConfiguration} physicsConfiguration The physics configuration.
 * @param {String} title A title for this mission.
 * @param {String} description A description of this mission.
 * @constructor
 */
export function Mission(objectives, editables, physicsConfiguration, title, description) {
    let _checking = null;
    let _finished = null;
    let _checkMarks = null;
    let _onChange=  null;

    const rewind = () => {
        _checking = objectives.slice();
        _finished = [];
        _checkMarks = new Array(objectives.length).fill(false);

        if (_onChange)
            _onChange(_checkMarks);
    };

    /**
     * Set the function that should be executed when a change in passed objectives occurs.
     * The function will get one parameter which is a boolean array mapping on the objectives of this mission.
     * @param {Function} onChange A function to call when a change in passed objectives occurs.
     */
    this.setOnChange = onChange => _onChange = onChange;

    /**
     * Get the physics configuration.
     * @returns {PhysicsConfiguration} The physics configuration.
     */
    this.getPhysicsConfiguration = () => physicsConfiguration;

    /**
     * Get this missions title.
     * @returns {String} The mission title.
     */
    this.getTitle = () => title;

    /**
     * Get this missions description.
     * @returns {String} The mission description.
     */
    this.getDescription = () => description;

    /**
     * Prime this mission for operation.
     * @param {Array} objects An array containing all editable PCB's as game objects in order.
     */
    this.prime = objects => {
        rewind();

        for (const objective of objectives)
            objective.prime(objects);
    };

    /**
     * Check all unfinished objectives.
     * @returns {Boolean} A boolean indicating whether all objectives have been completed.
     */
    this.validate = () => {
        let _changed = false;

        for (let i = _checking.length; i-- > 0;) if (_checking[i].validate()) {
            _finished.push(_checking[i]);
            _checkMarks[objectives.indexOf(_checking[i])] = _changed = true;
            _checking.splice(i, 1);
        }

        if (_changed && _onChange)
            _onChange(_checkMarks);

        return _checking.length === 0;
    };

    /**
     * Get the objectives of this mission.
     * @returns {Array} An array of objectives.
     */
    this.getObjectives = () => objectives;

    /**
     * Get the editables of this mission.
     * @returns {Array} An array of editables.
     */
    this.getEditables = () => editables;

    /**
     * Check whether this mission is finished.
     * @returns {Boolean} A boolean indicating whether this mission has finished.
     */
    this.isFinished = () => {
        for (const checkMark of _checkMarks) if (!checkMark)
            return false;

        return true;
    };

    rewind();
}