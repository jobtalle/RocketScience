import "../../../styles/overlay.css"
import {OverlayPinouts} from "./overlayPinouts";

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
        _element.style.left = xOffset + "px";
    };

    /**
     * Clear all overlay elements.
     */
    this.clear = () => {
        let element;

        while (element = _element.firstChild)
            _element.removeChild(element);
    };

    /**
     * Move the overlay to a certain position.
     * @param {Number} x The x position in pixels.
     * @param {Number} y The y position in pixels.
     * @param {Number} scale The scale as a factor.
     */
    this.move = (x, y, scale) => {
        _element.style.transform = "scale(" + scale + ") translate(" + x + "px," + y + "px)";
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

    /**
     * Make a pinout overlay for a configured part at a location.
     * @param {Number} x The x location on the pcb.
     * @param {Number} y The y location on the pcb.
     * @param {Object} configuration A valid part configuration.
     */
    this.makeOverlay = (x, y, configuration) => {
        this.clear();

        if (x)
            _element.appendChild(new OverlayPinouts(x, y, configuration).getElement());
    };

    build();
}

Overlay.ID = "editor-overlay";