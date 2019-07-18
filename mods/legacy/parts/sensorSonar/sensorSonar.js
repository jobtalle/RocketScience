/**
 * A sonar.
 * @param {Object} context An object containing the game context, and references to some important utils.
 * @constructor
 */
function SensorSonar(context) {
    const PIN_INDEX_POWER = 0;
    const PIN_INDEX_OUTPUT = 1;

    let _ray = null;

    /**
     * Initialize the state.
     * @param {Body} body A physics body to apply state to.
     */
    this.initialize = body => {
        _ray = body.createRay(
            (context.x + 1) * context.refs.Scale.METERS_PER_POINT,
            (context.y + 1) * context.refs.Scale.METERS_PER_POINT,
            new context.refs.Myr.Vector(5, 0));
    };

    /**
     * Update the state.
     * @param {Array} state A state array to read from and/or write to.
     */
    this.tick = state => {
        if (state[context.pins[PIN_INDEX_POWER]] === 1)
            state[context.pins[PIN_INDEX_OUTPUT]] = 1 - _ray.getLength();
        else
            state[context.pins[PIN_INDEX_OUTPUT]] = 0;
    };
}
