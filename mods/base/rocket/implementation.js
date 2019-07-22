/**
 * A rocket.
 * @param {Object} context An object containing the game context, and references to some important utils.
 * @constructor
 */
function Rocket(context) {
    const PIN_INDEX_POWER = 0;
    const PIN_INDEX_INPUT = 1;
    const MAX_FORCE = -550;

    let mover = null;
    let force = new context.refs.Myr.Vector(0, 0);

    /**
     * Initialize the state.
     * @param {Physics} body A physics body to apply state to.
     */
    this.initialize = body => {
        mover = body.createMover(
            (context.x + 1.5) * context.refs.Scale.METERS_PER_POINT,
            (context.y + 4.5) * context.refs.Scale.METERS_PER_POINT);
    };

    /**
     * Update the state.
     * @param {Array} state A state array to read from and/or write to.
     */
    this.tick = state => {
        if (state[context.pins[PIN_INDEX_POWER]] === 1) {
            force.x = 0;
            force.y = MAX_FORCE * state[context.pins[PIN_INDEX_INPUT]];

            if (force.y === 0)
                mover.setForce(null);
            else
                mover.setForce(force);
        }
        else
            mover.setForce(null);
    };
}