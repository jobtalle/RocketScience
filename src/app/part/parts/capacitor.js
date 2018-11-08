/**
 * A capacitor.
 * @param {Array} pins An array containing the pin indices.
 * @constructor
 */
export function Capacitor(pins) {
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
    };
}

Capacitor.MAX_CHARGE = 10;
Capacitor.PIN_INDEX_INPUT = 0;
Capacitor.PIN_INDEX_OUTPUT = 1;