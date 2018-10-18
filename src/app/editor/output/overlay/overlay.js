import "../../../../styles/overlay.css"
import {OverlayPinouts} from "./pinouts/overlayPinouts";
import {OverlayRulers} from "./rulers/overlayRulers";

/**
 * An overlay for the PCB editor.
 * @param {Object} overlay An overlay element for HTML GUI.
 * @param {Number} xOffset The editor view x offset.
 * @constructor
 */
export function Overlay(overlay, xOffset) {
    const _element = document.createElement("div");

    let _pinouts = null;
    let _rulers = null;

    const build = () => {
        _element.id = Overlay.ID;
        _element.style.left = xOffset + "px";
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
     * @param {Number} [highlightIndex] An optional pin index to highlight. Don't provide if all pins must be shown.
     * @param {Myr.Vector} [highlightDirection] An optional direction for the highlighted pin label.
     */
    this.makePinouts = (x, y, configuration, highlightIndex, highlightDirection) => {
        this.clearPinouts();

        _pinouts = new OverlayPinouts(x, y, configuration, highlightIndex, highlightDirection).getElement();
        _element.appendChild(_pinouts);
    };

    /**
     * Clear any pinout overlay.
     */
    this.clearPinouts = () => {
        if (_pinouts) {
            _element.removeChild(_pinouts);
            _pinouts = null;
        }
    };

    /**
     * Make rulers on this overlay.
     * @param {Array} definitions An array of OverlayRulerDefinition objects.
     */
    this.makeRulers = definitions => {
        this.clearRulers();

        _rulers = new OverlayRulers(definitions).getElement();
        _element.appendChild(_rulers);
    };

    /**
     * Clear any rulers.
     */
    this.clearRulers = () => {
        if (_rulers) {
            _element.removeChild(_rulers);
            _rulers = null;
        }
    };

    build();
}

Overlay.ID = "editor-overlay";