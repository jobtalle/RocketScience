/**
 * A capacitor.
 * @param {Array} pins An array containing the pin indices.
 * @param {PartRenderer} renderer A part renderer to render state to.
 * @constructor
 */
export function Capacitor(pins, renderer) {
    let _charge = 0;

    this.initialize = () => {

    };

    this.tick = state => {
        if (state[pins[Capacitor.PIN_INDEX_INPUT]] === 0) {
            state[pins[Capacitor.PIN_INDEX_OUTPUT]] = 0;

            _charge = Math.max(0, _charge - 1);
        }
        else {
            _charge = Math.min(Capacitor.MAX_CHARGE, _charge + state[pins[Capacitor.PIN_INDEX_INPUT]]);

            if (_charge === Capacitor.MAX_CHARGE)
                state[pins[Capacitor.PIN_INDEX_OUTPUT]] = state[pins[Capacitor.PIN_INDEX_INPUT]];
            else
                state[pins[Capacitor.PIN_INDEX_OUTPUT]] = 0;
        }

        renderer.getSprites()[Capacitor.SPRITE_INDEX_METER].setFrame(
            Math.floor(Capacitor.SPRITE_FRAME_FULL * (_charge / Capacitor.MAX_CHARGE))
        );
    };
}

Capacitor.SPRITE_INDEX_METER = 0;
Capacitor.SPRITE_FRAME_FULL = 4;
Capacitor.MAX_CHARGE = 10;
Capacitor.PIN_INDEX_INPUT = 0;
Capacitor.PIN_INDEX_OUTPUT = 1;