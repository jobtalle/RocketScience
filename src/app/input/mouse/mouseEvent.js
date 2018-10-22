/**
 * A mouse event.
 * @param {Number} type One of the valid mouse event type constants of this object.
 * @param {Number} x The x coordinate in pixels.
 * @param {Number} y The y coordinate in pixels.
 * @param {Number} wheelDelta The mouse wheel delta.
 * @constructor
 */
export function MouseEvent(type, x, y, wheelDelta) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.wheelDelta = wheelDelta;
}

/**
 * Make a mouse press event.
 * @param {Number} x The x coordinate in pixels.
 * @param {Number} y The y coordinate in pixels.
 * @returns {MouseEvent} A mouse event.
 */
MouseEvent.makePress = (x, y) => {
    return new MouseEvent(MouseEvent.EVENT_PRESS_LMB, x, y, 0)
};

/**
 * Make a mouse release event.
 * @param {Number} x The x coordinate in pixels.
 * @param {Number} y The y coordinate in pixels.
 * @returns {MouseEvent} A mouse event.
 */
MouseEvent.makeRelease = (x, y) => {
    return new MouseEvent(MouseEvent.EVENT_RELEASE_LMB, x, y, 0)
};

/**
 * Make a mouse scroll event.
 * @param {Number} x The x coordinate in pixels.
 * @param {Number} y The y coordinate in pixels.
 * @param {Number} delta The scroll delta.
 * @returns {MouseEvent} A mouse event.
 */
MouseEvent.makeScroll = (x, y, delta) => {
    return new MouseEvent(MouseEvent.EVENT_SCROLL, x, y, delta)
};

/**
 * Make a mouse move event.
 * @param {Number} x The x coordinate in pixels.
 * @param {Number} y The y coordinate in pixels.
 * @returns {MouseEvent} A mouse event.
 */
MouseEvent.makeMove = (x, y) => {
    return new MouseEvent(MouseEvent.EVENT_MOVE, x, y, 0)
};

/**
 * Make a mouse enter event.
 * @param {Number} x The x coordinate in pixels.
 * @param {Number} y The y coordinate in pixels.
 * @returns {MouseEvent} A mouse event.
 */
MouseEvent.makeEnter = (x, y) => {
    return new MouseEvent(MouseEvent.EVENT_ENTER, x, y, 0)
};

/**
 * Make a mouse leave event.
 * @param {Number} x The x coordinate in pixels.
 * @param {Number} y The y coordinate in pixels.
 * @returns {MouseEvent} A mouse event.
 */
MouseEvent.makeLeave = (x, y) => {
    return new MouseEvent(MouseEvent.EVENT_LEAVE, x, y, 0)
};

MouseEvent.EVENT_PRESS_LMB = 0;
MouseEvent.EVENT_RELEASE_LMB = 1;
MouseEvent.EVENT_SCROLL = 2;
MouseEvent.EVENT_MOVE = 3;
MouseEvent.EVENT_ENTER = 4;
MouseEvent.EVENT_LEAVE = 5;