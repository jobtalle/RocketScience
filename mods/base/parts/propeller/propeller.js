/**
 * A propeller.
 * @param {Object} context An object containing the game context, and references to some important utils.
 * @constructor
 */
function Propeller(context) {
    const PIN_INDEX_POWER = 0;
    const PIN_INDEX_INPUT = 1;
    const SPRITE_INDEX_PROPELLER = 1;
    const MAX_FORCE = -4500;

    let mover = null;
    let moving = false;

    /**
     * Initialize the state.
     * @param {Object} body A physics body to apply state to.
     */
    this.initialize = body => {
        mover = body.createMover(
            (context.x + 2) * context.refs.Scale.METERS_PER_POINT,
            (context.y - 0.5) * context.refs.Scale.METERS_PER_POINT);
    };

    /**
     * Update the state.
     * @param {Array} state A state array to read from and/or write to.
     */
    this.tick = state => {
        if (state[context.pins[PIN_INDEX_POWER]] === 1 && state[context.pins[PIN_INDEX_INPUT]] !== 0) {
            mover.setForce(new context.refs.Myr.Vector(0, MAX_FORCE * state[context.pins[PIN_INDEX_INPUT]]));

            moving = true;
        }
        else {
            mover.setForce(null);

            moving = false;
        }
    };

    /**
     * Update the part.
     * @param {Number} timeStep The time step.
     */
    this.update = timeStep => {
        if (moving)
            context.renderer.getSprites()[SPRITE_INDEX_PROPELLER].animate(timeStep);
    };
}
