/**
 * @param {Object} behavior A behavior object matching this state object.
 * @constructor
 */
export function OscillatorState(behavior) {
    let _out = 1;

    /**
     * Update the state.
     * @param {Array} state A state array to read from and/or write to.
     */
    this.tick = state => {
        _out = 1 - _out;

        console.log(_out);
    };
}