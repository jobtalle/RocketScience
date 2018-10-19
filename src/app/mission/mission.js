/**
 * A mission consists of one or multiple objectives.
 * @param {Array} objectives All objectives required to complete this mission.
 * @constructor
 */
export function Mission(objectives) {
    let _checking = null;
    let _finished = null;

    const rewind = () => {
        _checking = objectives.slice();
        _finished = [];
    };

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
     */
    this.validate = () => {
        for (let i = _checking.length; i-- > 0;) if (_checking[i].validate())
            _finished.push(_checking[i]), _checking.splice(i, 1);
    };

    rewind();
}