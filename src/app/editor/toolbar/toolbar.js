import "../../../styles/toolbar.css"
import {ToolbarButton} from "./toolbarButton";

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

        const buttonExtend = new ToolbarButton(function(){}, "toolbar-extend");
        const buttonSelect = new ToolbarButton(function(){}, "toolbar-select");

        _container.appendChild(buttonExtend.getElement());
        _container.appendChild(buttonSelect.getElement());

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