/**
 * A capacitor.
 * @param {Object} context An object containing the game context, and references to some important utils.
 * @constructor
 */
function Capacitor(context) {
    const SPRITE_INDEX_METER = 0;
    const SPRITE_FRAME_FULL = 4;
    const MAX_CHARGE = 10;
    const PIN_INDEX_INPUT = 0;
    const PIN_INDEX_OUTPUT = 1;

    let _charge = 0;

    this.initialize = () => {

    };

    this.tick = state => {
        if (state[context.pins[PIN_INDEX_INPUT]] === 0) {
            state[context.pins[PIN_INDEX_OUTPUT]] = 0;

            _charge = Math.max(0, _charge - 1);
        }
        else {
            _charge = Math.min(MAX_CHARGE, _charge + state[context.pins[PIN_INDEX_INPUT]]);

            if (_charge === MAX_CHARGE)
                state[context.pins[PIN_INDEX_OUTPUT]] = state[context.pins[PIN_INDEX_INPUT]];
            else
                state[context.pins[PIN_INDEX_OUTPUT]] = 0;
        }

        context.renderer.getSprites()[SPRITE_INDEX_METER].setFrame(
            Math.floor(SPRITE_FRAME_FULL * (_charge / MAX_CHARGE))
        );
    };
}