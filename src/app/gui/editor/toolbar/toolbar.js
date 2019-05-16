import "../../../../styles/toolbar.css"
import {ToolbarButton} from "./toolbarButton";
import {PcbEditor} from "../pcb/pcbEditor";
import {getString} from "../../../text/language";
import {Game} from "../../../game";

/**
 * A toolbar containing buttons for the PCB editor.
 * @param {PcbEditor} editor A PcbEditor which places selected objects.
 * @param {HTMLElement} overlay The element to place the toolbar on.
 * @param {Number} x The X position of the toolbar in pixels.
 * @param {Game} game A game.
 * @constructor
 */
export function Toolbar(editor, overlay, x, game) {
    const _container = document.createElement("div");
    const _toggleGroupSelectMode = new ToolbarButton.ToggleGroup();
    const _buttonExtend = new ToolbarButton(
        () => editor.setEditMode(PcbEditor.EDIT_MODE_RESHAPE),
        getString(Toolbar.TEXT_EXTEND),
        "toolbar-extend",
        ToolbarButton.TYPE_TOGGLE_GROUP,
        _toggleGroupSelectMode);
    const _buttonSelect = new ToolbarButton(
        () => editor.setEditMode(PcbEditor.EDIT_MODE_SELECT),
        getString(Toolbar.TEXT_SELECT),
        "toolbar-select",
        ToolbarButton.TYPE_TOGGLE_GROUP,
        _toggleGroupSelectMode);
    const _buttonEtch = new ToolbarButton(
        () => editor.setEditMode(PcbEditor.EDIT_MODE_ETCH),
        getString(Toolbar.TEXT_ETCH),
        "toolbar-etch",
        ToolbarButton.TYPE_TOGGLE_GROUP,
        _toggleGroupSelectMode);
    const _buttonMove = new ToolbarButton(
        () => editor.setEditMode(PcbEditor.EDIT_MODE_MOVE),
        getString(Toolbar.TEXT_MOVE),
        "toolbar-move",
        ToolbarButton.TYPE_TOGGLE_GROUP,
        _toggleGroupSelectMode);
    const _buttonLaunch = new ToolbarButton(
        () => game.setMode(Game.MODE_GAME),
        getString(Toolbar.TEXT_LAUNCH),
        "toolbar-launch",
        ToolbarButton.TYPE_CLICK);
    const _buttonXRay = new ToolbarButton(
        pressed => editor.setXRay(pressed),
        getString(Toolbar.TEXT_X_RAY),
        "toolbar-xray",
        ToolbarButton.TYPE_TOGGLE);
    const _buttonExit = new ToolbarButton(
        () => game.setMode(Game.MODE_MENU),
        getString(Toolbar.TEXT_EXIT),
        "toolbar-exit",
        ToolbarButton.TYPE_CLICK);

    const makeSpacer = () => {
        const element = document.createElement("div");

        element.classList.add("spacer");
        element.classList.add("sprite");
        element.classList.add("toolbar-spacer");

        return element;
    };

    const build = () => {
        _container.id = Toolbar.ID;
        _container.style.left = x + "px";

        _container.appendChild(_buttonExtend.getElement());
        _container.appendChild(_buttonSelect.getElement());
        _container.appendChild(_buttonEtch.getElement());
        _container.appendChild(_buttonMove.getElement());
        _container.appendChild(makeSpacer());
        _container.appendChild(_buttonLaunch.getElement());
        _container.appendChild(_buttonXRay.getElement());
        _container.appendChild(makeSpacer());
        _container.appendChild(_buttonExit.getElement());
    };

    /**
     * Set all buttons to their defaults. Make sure to default after the PCB editor has initialized.
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
     * A key event has been fired.
     * @param {KeyEvent} event A key event.
     */
    this.onKeyEvent = event => {
        if (event.down) {
            switch (event.key) {
                case Toolbar.KEY_PRESS_EXTEND:
                    _buttonExtend.getElement().click();

                    break;
                case Toolbar.KEY_PRESS_SELECT:
                    _buttonSelect.getElement().click();

                    break;
                case Toolbar.KEY_PRESS_ETCH:
                    _buttonEtch.getElement().click();

                    break;
                case Toolbar.KEY_PRESS_MOVE:
                    _buttonMove.getElement().click();

                    break;
                case Toolbar.KEY_PRESS_LAUNCH:
                    _buttonLaunch.getElement().click();

                    break;
                case Toolbar.KEY_PRESS_XRAY:
                    _buttonXRay.getElement().click();

                    break;
                case Toolbar.KEY_PRESS_EXIT:
                    _buttonExit.getElement().click();

                    break;
            }
        }
        else {
            switch (event.key) {
                case Toolbar.KEY_PRESS_XRAY:
                    _buttonXRay.getElement().click();

                    break;
            }
        }
    };

    build();
}

Toolbar.ID = "toolbar";
Toolbar.KEY_PRESS_EXTEND = "1";
Toolbar.KEY_PRESS_SELECT = "2";
Toolbar.KEY_PRESS_ETCH = "3";
Toolbar.KEY_PRESS_MOVE = "4";
Toolbar.KEY_PRESS_LAUNCH = " ";
Toolbar.KEY_PRESS_XRAY = "x";
Toolbar.KEY_PRESS_EXIT = "Escape";
Toolbar.TEXT_EXTEND = "TOOLBAR_EXTEND";
Toolbar.TEXT_SELECT = "TOOLBAR_SELECT";
Toolbar.TEXT_ETCH = "TOOLBAR_ETCH";
Toolbar.TEXT_MOVE = "TOOLBAR_MOVE";
Toolbar.TEXT_LAUNCH = "TOOLBAR_LAUNCH";
Toolbar.TEXT_X_RAY = "TOOLBAR_X_RAY";
Toolbar.TEXT_EXIT = "TOOLBAR_EXIT";
Toolbar.TEXT_MOVE_REGION = "TOOLBAR_MOVE_REGION";
Toolbar.TEXT_RESIZE_REGION = "TOOLBAR_RESIZE_REGION";