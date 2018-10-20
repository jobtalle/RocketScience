import {Overlay} from "./overlay/overlay";
import {Info} from "./info/info";

/**
 * Output elements of the editor.
 * @param {RenderContext} renderContext A render context.
 * @constructor
 */
export function EditorOutput(renderContext) {
    const _overlay = new Overlay(renderContext.getViewport().getElement(), renderContext.getViewport().getSplitX());
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

    /**
     * Show the editors.
     */
    this.show = () => {
        _overlay.show();
    };

    /**
     * Hide the editors.
     */
    this.hide = () => {
        _overlay.hide();
    };

    /**
     * Free all resources.
     */
    this.free = () => {

    };

    /**
     * Update the editors.
     * @param {Number} timeStep The number of seconds passed since the last update.
     */
    this.update = timeStep => {

    };

    /**
     * Draw the editor.
     */
    this.draw = () => {

    };
}