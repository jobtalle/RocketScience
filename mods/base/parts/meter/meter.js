/**
 * A signal meter.
 * @param {Object} context An object containing the game context, and references to some important utils.
 * @constructor
 */
function Meter(context) {
    const PIN_INPUT = 0;
    const SPRITE_INDEX_DIAL = 1;

    let _spring = new context.refs.SpringApproach(0, 0, 0, Math.PI);

    /**
     * Initialize the state.
     */
    this.initialize = () => {

    };

    /**
     * Update the state.
     * @param {Array} state A state array to read from and/or write to.
     */
    this.tick = state => {
        _spring.setTarget(state[context.pins[PIN_INPUT]] * Math.PI);
    };

    /**
     * Update the part.
     * @param {Number} timeStep The current time step.
     */
    this.update = timeStep => {
        _spring.update(timeStep);

        const dialTransform = context.renderer.getTransforms()[SPRITE_INDEX_DIAL];

        dialTransform.identity();
        dialTransform.translate(context.refs.Scale.PIXELS_PER_POINT, 1);
        dialTransform.rotate(-_spring.getValue());
        dialTransform.translate(-context.refs.Scale.PIXELS_PER_POINT, -context.refs.Scale.PIXELS_PER_POINT * 0.5 - 1);
    };
}
