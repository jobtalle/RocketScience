/**
 * A key press event.
 * @param {String} key The string corresponding to the pressed key.
 * @param {Boolean} down A boolean indicating whether the key is pressed down (true), or up (false).
 * @param {Boolean} shift A boolean indicating whether the shift key is down.
 * @param {Boolean} control A boolean indicating whether the control key is down.
 * @constructor
 */
export function KeyEvent(key, down, shift, control) {
    this.key = key;
    this.down = down;
    this.shift = shift;
    this.control = control;
}