import Myr from "../lib/myr.js"
import {Sprites} from "./sprites";
import {Viewport} from "./editor/viewport";

/**
 * The render context provides access to all objects that allow rendering.
 * @param {HTMLElement} canvas A canvas to render real time graphics to.
 * @param {HTMLElement} overlay An HTML element to render the GUI to.
 * @constructor
 */
export function RenderContext(canvas, overlay) {
    const _myr = new Myr(canvas);
    const _sprites = new Sprites(_myr);
    const _viewport = new Viewport(_myr.getWidth(), RenderContext.INTERFACE_SPLIT, overlay);

    /**
     * Get the viewport for this render context.
     * @returns {Viewport} The viewport of this render context.
     */
    this.getViewport = () => _viewport;

    /**
     * Get the Myriad instance of this render context.
     * @returns {Myr} An instantiated Myriad instance.
     */
    this.getMyr = () => _myr;

    /**
     * Get the sprites object with valid sprites for this render context.
     * @returns {Sprites} The sprites object.
     */
    this.getSprites = () => _sprites;

    /**
     * Get the overlay element.
     * @returns {HTMLElement} The overlay element.
     */
    this.getOverlay = () => overlay;

    /**
     * Get this render context's width.
     * @returns {Number} The width in pixels.
     */
    this.getWidth = () => _myr.getWidth();

    /**
     * Get this render context's height.
     * @returns {Number} The height in pixels.
     */
    this.getHeight = () => _myr.getHeight();
}

RenderContext.INTERFACE_SPLIT = 0.3;