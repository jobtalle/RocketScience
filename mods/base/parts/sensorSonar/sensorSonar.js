/**
 * @param {Array} pins An array containing the pin indices.
 * @param {PartRenderer} renderer A part renderer to render state to.
 * @param {Number} x The X location on the board.
 * @param {Number} y The Y location on the board.
 * @constructor
 */
function SensorSonar(context) {
    let _ray = null;

    const PIN_INDEX_POWER = 0;
    const PIN_INDEX_OUTPUT = 1;

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
