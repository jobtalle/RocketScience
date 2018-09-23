import "../../../../styles/toolbar.css"
import {ToolbarButton} from "./toolbarButton";
import {PcbEditor} from "../pcb/pcbEditor";

/**
 * A toolbar containing buttons for the PCB editor.
 * @param {PcbEditor} editor A PcbEditor which places selected objects.
 * @param {Object} overlay An overlay element for HTML GUI.
 * @param {Number} x The X position of the toolbar in pixels.
 * @param {Object} game An interface to interact with the game object.
 * @constructor
 */
export function Toolbar(editor, overlay, x, game) {
    const _toggleGroupSelectMode = new ToolbarButton.ToggleGroup();
    const _buttonExtend = new ToolbarButton(
        () => editor.setEditMode(PcbEditor.EDIT_MODE_RESHAPE),
        "toolbar-extend",
        _toggleGroupSelectMode);
    const _buttonSelect = new ToolbarButton(
        () => editor.setEditMode(PcbEditor.EDIT_MODE_SELECT),
        "toolbar-select",
        _toggleGroupSelectMode);
    const _buttonEtch = new ToolbarButton(
        () => editor.setEditMode(PcbEditor.EDIT_MODE_ETCH),
        "toolbar-etch",
        _toggleGroupSelectMode);
    const _buttonLaunch = new ToolbarButton(
        () => game.toggleEdit(),
        "toolbar-launch");

    let _container = null;

    const makeSpacer = () => {
        const element = document.createElement("div");

        element.classList.add("spacer");
        element.classList.add("sprite");
        element.classList.add("toolbar-spacer");

        return element;
    };

    const build = () => {
        _container = document.createElement("div");
        _container.id = Toolbar.ID;
        _container.style.left = x + "px";

        _container.appendChild(_buttonExtend.getElement());
        _container.appendChild(_buttonSelect.getElement());
        _container.appendChild(_buttonEtch.getElement());
        _container.appendChild(makeSpacer());
        _container.appendChild(_buttonLaunch.getElement());
    };

    /**
     * Set all buttons to their defaults. Make sure to default after the pcb editor has initialized.
     */
    this.default = () => {
        _buttonSelect.getElement().click();
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

    /**
     * A key is pressed.
     * @param {String} key A key.
     */
    this.onKeyDown = (key) => {
        switch (key) {
            case Toolbar.KEY_PRESS_EXTEND:
                _buttonExtend.getElement().click();
                break;
            case Toolbar.KEY_PRESS_SELECT:
                _buttonSelect.getElement().click();
                break;
            case Toolbar.KEY_PRESS_ETCH:
                _buttonEtch.getElement().click();
                break;
            case Toolbar.KEY_PRESS_LAUNCH:
                _buttonLaunch.getElement().click();
                break;
        }
    };

    build();
}

Toolbar.ID = "toolbar";
Toolbar.KEY_PRESS_EXTEND = "1";
Toolbar.KEY_PRESS_SELECT = "2";
Toolbar.KEY_PRESS_ETCH = "3";
Toolbar.KEY_PRESS_LAUNCH = " ";