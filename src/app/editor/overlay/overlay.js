import "../../../styles/overlay.css"

/**
 * An overlay for the PCB editor.
 * @param {Object} overlay An overlay element for HTML GUI.
 * @param {Number} xOffset The editor view x offset.
 * @constructor
 */
export function Overlay(overlay, xOffset) {
    const _element = document.createElement("div");

    const build = () => {
        _element.id = Overlay.ID;
        _element.style.left = xOffset.toString() + "px";
    };

    /**
     * Move the overlay to a certain position.
     * @param {Number} x The x position in pixels.
     * @param {Number} y The y position in pixels.
     * @param {Number} scale The scale as a factor.
     */
    this.move = (x, y, scale) => {
        _element.style.transform = "scale(" + scale.toString() + ") translate(" + x.toString() + "px, " + y.toString() + "px)";
    };

    /**
     * Show the overlay.
     */
    this.show = () => {
        overlay.appendChild(_element);
    };

    /**
     * Hide the overlay. This does not delete the toolbar.
     * It can be shown again later using show().
     */
    this.hide = () => {
        overlay.removeChild(_element);
    };

    build();
}

Overlay.ID = "editor-overlay";