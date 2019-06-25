/**
 * A touch sensor.
 * @param {Object} context An object containing the game context, and references to some important utils.
 * @constructor
 */
function SensorTouch(context) {
    const PIN_INDEX_SIGNAL = 0;
    const SIGNAL_TICK_COOLDOWN = 1;

    let sensor = null;
    let cooldown = 0;

    const beginContact = () => {
        cooldown = SIGNAL_TICK_COOLDOWN;
    };

    /**
     * Initialize the state.
     * @param {Body} body A physics body to apply state to.
     */
    this.initialize = body => {
        sensor = body.createTouchSensor(
            (context.x + 0.5) * context.refs.Scale.METERS_PER_POINT,
            (context.y + 0.5) * context.refs.Scale.METERS_PER_POINT,
            context.refs.Scale.METERS_PER_POINT,
            -Math.PI * 0.5,
            new context.refs.ContactListener(beginContact, null));
    };

    /**
     * Update the state.
     * @param {Array} state A state array to read from and/or write to.
     */
    this.tick = state => {
        if (cooldown > 0) {
            state[context.pins[PIN_INDEX_SIGNAL]] = 1;

            --cooldown;
        } else
            state[context.pins[PIN_INDEX_SIGNAL]] = 0;
    };
}
