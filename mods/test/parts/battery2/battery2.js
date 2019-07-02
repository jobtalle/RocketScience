/**
 * A modded battery with the same features as the standard battery.
 * @param {Object} context An object containing the game context, and references to some important utils.
 * @constructor
 */
function Battery2(context) {
    /**
     * Initialize the state.
     * @param {Physics} body A physics body to apply state to.
     */
    this.initialize = body => {

    };

    /**
     * Update the state.
     * @param {Array} state A state array to read from and/or write to.
     */
    this.tick = state => {
        for (let pin = 0; pin < 4; ++pin)
            state[context.pins[pin]] = 1;
    };
}