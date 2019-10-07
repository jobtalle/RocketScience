/**
 * A sonar.
 * @param {Object} context An object containing the game context, and references to some important utils.
 * @constructor
 */
function SensorSonar(context) {
    const PIN_INDEX_OUTPUT = 0;
    const CONFIGURATION_RIGHT = 0;
    const CONFIGURATION_LEFT = 1;
    const SONAR_RANGE = 5;

    let _ray = null;

    /**
     * Initialize the state.
     * @param {Body} body A physics body to apply state to.
     */
    this.initialize = body => {
        if (context.config === CONFIGURATION_RIGHT) {
            _ray = body.createRay(
                (context.x + 1) * context.refs.Scale.METERS_PER_POINT,
                (context.y + 1) * context.refs.Scale.METERS_PER_POINT,
                new context.refs.Myr.Vector(SONAR_RANGE, 0));
        } else if (context.config === CONFIGURATION_LEFT) {
            _ray = body.createRay(
                (context.x) * context.refs.Scale.METERS_PER_POINT,
                (context.y + 1) * context.refs.Scale.METERS_PER_POINT,
                new context.refs.Myr.Vector(-SONAR_RANGE, 0));
        }
    };

    /**
     * Update the state.
     * @param {Array} state A state array to read from and/or write to.
     */
    this.tick = state => {
        state[context.pins[PIN_INDEX_OUTPUT]] = 1 - _ray.getLength();
    };
}
