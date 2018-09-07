/**
 * @param {Array} pins An array containing the pin indices.
 * @param {PartRenderer} renderer A part renderer to render state to.
 * @param {Number} x The X location on the board.
 * @param {Number} y The Y location on the board.
 * @constructor
 */
export function Propeller(pins, renderer, x, y) {
    /**
     * Initialize the state.
     * @param {Object} body A physics body to apply state to.
     */
    this.initialize = body => {

    };

    /**
     * Update the state.
     * @param {Array} state A state array to read from and/or write to.
     */
    this.tick = state => {

    };
}

Propeller.PIN_INDEX_POWER = 0;
Propeller.PIN_INDEX_ON = 1;