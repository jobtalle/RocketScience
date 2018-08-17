import "../../../styles/toolbar.css"

/**
 * A toolbar containing buttons for the PCB editor.
 * @param {PcbEditor} editor A PcbEditor which places selected objects.
 * @param {Object} overlay An overlay element for HTML GUI.
 * @param {Number} x The X position of the toolbar in pixels.
 * @constructor
 */
export function Toolbar(editor, overlay, x) {
    let _container = null;

    const build = () => {
        _container = document.createElement("div");
        _container.id = Toolbar.ID;
        _container.style.left = x + "px";

        this.show();
    };

    /**
     * Hide the toolbar. This does not delete the toolbar.
     * It can be shown again later using show().
     */
    this.hide = () => {
        overlay.removeChild(_container);
    };

    /**
     * Show the toolbar.
     */
    this.show = () => {
        overlay.appendChild(_container);
    };

    build();
}

Toolbar.ID = "toolbar";