/**
 * A wheel that can be powered.
 * @param {Object} context An object containing the game context, and references to some important utils.
 * @constructor
 */
function WheelUnpowered(context) {
    const SPRITE_INDEX_WHEEL = 1;
    const RADIUS = 2.5;
    const ANCHOR_X = 1.5;
    const ANCHOR_Y = 1.5;

    let joint = null;

    const applyState = (state, intensity) => {
    };

    /**
     * Initialize the state.
     * @param {Object} body A physics body to apply state to.
     */
    this.initialize = body => {
        joint = body.createWheel(
            RADIUS * context.refs.Scale.METERS_PER_POINT,
            (context.x + ANCHOR_X) * context.refs.Scale.METERS_PER_POINT,
            (context.y + ANCHOR_Y) * context.refs.Scale.METERS_PER_POINT,
            context.renderer.getTransforms()[SPRITE_INDEX_WHEEL]);
    };

    /**
     * Update the state.
     * @param {Array} state A state array to read from and/or write to.
     */
    this.tick = state => {
    };
}
