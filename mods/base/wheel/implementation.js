/**
 * A wheel that can be powered.
 * @param {Object} context An object containing the game context, and references to some important utils.
 * @constructor
 */
function Wheel(context) {
    const SPRITE_INDEX_WHEEL = 1;
    const RADIUS = 2.5;
    const ANCHOR_X = 1.5;
    const ANCHOR_Y = 1.5;
    const PIN_INDEX_LEFT = 0;
    const PIN_INDEX_RIGHT = 1;
    const STATE_RELEASED = 0;
    const STATE_MOTOR_RIGHT = 2;
    const STATE_MOTOR_LEFT = 3;

    let currentState = STATE_RELEASED;
    let joint = null;

    const applyState = (state, intensity) => {
        switch (state) {
            case STATE_RELEASED:
                joint.release();
                break;
            case STATE_MOTOR_RIGHT:
                joint.powerRight(intensity);
                break;
            case STATE_MOTOR_LEFT:
                joint.powerLeft(intensity);
                break;
        }
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
        let newState;
        let intensity = 0;

        if (state[context.pins[PIN_INDEX_LEFT]] !== 0) {
            newState = STATE_MOTOR_LEFT;
            intensity = state[context.pins[PIN_INDEX_LEFT]];
        }
        else if (state[context.pins[PIN_INDEX_RIGHT]] !== 0) {
            newState = STATE_MOTOR_RIGHT;
            intensity = state[context.pins[PIN_INDEX_RIGHT]];
        }
        else
            newState = STATE_RELEASED;


        if (newState !== currentState) {
            currentState = newState;

            applyState(currentState, intensity);
        }
    };
}
