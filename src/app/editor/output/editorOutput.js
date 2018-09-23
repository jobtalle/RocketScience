import {Overlay} from "./overlay/overlay";
import {Info} from "./info/info";

/**
 * Output elements of the editor.
 * @param {Viewport} viewport A viewport.
 * @constructor
 */
export function EditorOutput(viewport) {
    const _overlay = new Overlay(viewport.getElement(), viewport.getSplitX());
    const _info = new Info(_overlay);

    /**
     * Get the overlay object.
     * @returns {Overlay} The Overlay object.
     */
    this.getOverlay = () => _overlay;

    /**
     * Get the info object.
     * @returns {Info} The info object.
     */
    this.getInfo = () => _info;
}