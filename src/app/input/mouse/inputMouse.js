import {MouseEvent} from "./MouseEvent";

/**
 * This object handles mouse input events.
 * @param {HTMLElement} element An HTML element to capture mouse events from.
 * @constructor
 */
export function InputMouse(element) {
    const _listeners = [];
    let _hover = true;
    let _x = null;
    let _y = null;

    const fireEvent = event => {
        for (const listener of _listeners)
            listener(event);
    };

    /**
     * Update the origin of the passed element.
     * This function must be called at least once to initialize the size.
     * @param {Number} x The x coordinate in pixels.
     * @param {Number} y The y coordinate in pixels.
     */
    this.setOrigin = (x, y) => {
        _x = x;
        _y = y;
    };

    /**
     * Add a listener to this object.
     * @param {Function} listener A function to be called on mouse events.
     */
    this.addListener = listener => _listeners.push(listener);

    /**
     * Remove a listener from this object.
     * @param {Function} listener A listener previously added through the addListener method.
     */
    this.removeListener = listener => _listeners.splice(_listeners.indexOf(listener), 1);

    element.addEventListener("mousedown", event => {
        if (event.target !== element)
            return;

        fireEvent(MouseEvent.makePress(event.clientX - _x, event.clientY - _y));
    });

    element.addEventListener("mouseup", event => {
        fireEvent(MouseEvent.makeRelease(event.clientX - _x, event.clientY - _y));
    });

    element.addEventListener("mousemove", event => {
        if (event.target !== element) {
            if (_hover) {
                fireEvent(MouseEvent.makeLeave(event.clientX - _x, event.clientY - _y));

                _hover = false;
            }
        }
        else {
            if (!_hover) {
                fireEvent(MouseEvent.makeEnter(event.clientX - _x, event.clientY - _y));

                _hover = true;
            }

            fireEvent(MouseEvent.makeMove(event.clientX - _x, event.clientY - _y));
        }
    });

    element.addEventListener("mouseenter", event => {
        if (event.target !== element)
            return;

        fireEvent(MouseEvent.makeEnter(event.clientX - _x, event.clientY - _y));

        _hover = true;
    });

    element.addEventListener("mouseleave", event => {
        if (event.target !== element)
            return;

        if (_hover) {
            fireEvent(MouseEvent.makeLeave(event.clientX - _x, event.clientY - _y));

            _hover = false;
        }
    });

    element.addEventListener("wheel", event => {
        if (event.target !== element)
            return;

        if (event.deltaY < 0)
            fireEvent(MouseEvent.makeScroll(event.clientX - _x, event.clientY - _y, 1));
        else
            fireEvent(MouseEvent.makeScroll(event.clientX - _x, event.clientY - _y, -1));
    });
}