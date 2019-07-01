import "../../../../styles/toolbar.css"
import {ToolbarButton} from "./toolbarButton";
import {PcbEditor} from "../pcb/pcbEditor";
import {getString} from "../../../text/language";
import {Game} from "../../../game";
import {Editable} from "../../../mission/editable/editable";
import * as Myr from "myr.js";
import {Data} from "../../../file/data";
import {DownloadBinary} from "../../../utils/downloadBinary";

/**
 * A toolbar containing buttons for the PCB editor.
 * @param {PcbEditor} editor A PcbEditor which places selected objects.
 * @param {Editables} editables An Editables object which holds all editables.
 * @param {HTMLElement} overlay The element to place the toolbar on.
 * @param {Number} x The X position of the toolbar in pixels.
 * @param {World} world The game world.
 * @param {Game} game A game.
 * @param {User} user The user.
 * @param {Boolean} isMissionEditor Enables mission editor functionality.
 * @constructor
 */
export function Toolbar(editor, editables, overlay, x, world, game, user, isMissionEditor) {
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
    const _buttonUndo = new ToolbarButton(
        () => editor.undo(),
        getString(Toolbar.TEXT_UNDO),
        "toolbar-undo",
        ToolbarButton.TYPE_CLICK);
    const _buttonRedo = new ToolbarButton(
        () => editor.redo(),
        getString(Toolbar.TEXT_REDO),
        "toolbar-redo",
        ToolbarButton.TYPE_CLICK);
    const _buttonAddRegion = new ToolbarButton(
        () => editables.addEditable(Editable.defaultEditable(editor.getEditable().getRegion().getOrigin().copy())),
        getString(Toolbar.TEXT_ADD_REGION),
        "toolbar-add-region",
        ToolbarButton.TYPE_CLICK);
    const _buttonCopyRegion = new ToolbarButton(
        () => editables.addEditable(editor.getEditable().copy()),
        getString(Toolbar.TEXT_COPY_REGION),
        "toolbar-copy-region",
        ToolbarButton.TYPE_CLICK);
    const _buttonRemoveRegion = new ToolbarButton(
        () => editables.removeEditable(editor.getEditable()),
        getString(Toolbar.TEXT_REMOVE_REGION),
        "toolbar-remove-region",
        ToolbarButton.TYPE_CLICK);
    const _buttonSavePcb = new ToolbarButton(
        () => user.savePcb("test", editor.getEditable().getPcb()),
        getString(Toolbar.TEXT_SAVE_PCB),
        "toolbar-save-pcb",
        ToolbarButton.TYPE_CLICK
        );
    const _buttonSaveMission = new ToolbarButton(
        () => {
            const missionData = new Data();

            world.getMission().serialize(missionData.getBuffer());

            const fileName = world.getMission().getTitle().replace(/[\\/:\*\?"<>\|\s+]/g, '').toLowerCase() + ".bin";

            DownloadBinary(missionData.getBlob(), fileName);
        },
        getString(Toolbar.TEXT_SAVE_MISSION),
        "toolbar-save-mission",
        ToolbarButton.TYPE_CLICK
        );

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
        _container.appendChild(_buttonSavePcb.getElement());
        _container.appendChild(makeSpacer());
        _container.appendChild(_buttonLaunch.getElement());
        _container.appendChild(_buttonXRay.getElement());
        _container.appendChild(makeSpacer());
        _container.appendChild(_buttonUndo.getElement());
        _container.appendChild(_buttonRedo.getElement());
        _container.appendChild(makeSpacer());
        _container.appendChild(_buttonExit.getElement());

        if (isMissionEditor) {
            _container.appendChild(makeSpacer());
            _container.appendChild(_buttonAddRegion.getElement());
            _container.appendChild(_buttonCopyRegion.getElement());
            _container.appendChild(_buttonRemoveRegion.getElement());
            _container.appendChild(makeSpacer());
            _container.appendChild(_buttonSaveMission.getElement());
        }
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
                case Toolbar.KEY_PRESS_UNDO:
                    _buttonUndo.getElement().click();

                    break;
                case Toolbar.KEY_PRESS_REDO:
                    _buttonRedo.getElement().click();

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
Toolbar.KEY_PRESS_UNDO = "z";
Toolbar.KEY_PRESS_REDO = "y";
Toolbar.TEXT_EXTEND = "TOOLBAR_EXTEND";
Toolbar.TEXT_SELECT = "TOOLBAR_SELECT";
Toolbar.TEXT_ETCH = "TOOLBAR_ETCH";
Toolbar.TEXT_MOVE = "TOOLBAR_MOVE";
Toolbar.TEXT_LAUNCH = "TOOLBAR_LAUNCH";
Toolbar.TEXT_X_RAY = "TOOLBAR_X_RAY";
Toolbar.TEXT_EXIT = "TOOLBAR_EXIT";
Toolbar.TEXT_UNDO = "TOOLBAR_UNDO";
Toolbar.TEXT_REDO = "TOOLBAR_REDO";
Toolbar.TEXT_MOVE_REGION = "TOOLBAR_MOVE_REGION";
Toolbar.TEXT_RESIZE_REGION = "TOOLBAR_RESIZE_REGION";
Toolbar.TEXT_COPY_REGION = "TOOLBAR_COPY_REGION";
Toolbar.TEXT_ADD_REGION = "TOOLBAR_ADD_REGION";
Toolbar.TEXT_REMOVE_REGION = "TOOLBAR_REMOVE_REGION";
Toolbar.TEXT_SAVE_PCB = "TOOLBAR_SAVE_PCB";
Toolbar.TEXT_SAVE_MISSION = "TEXT_SAVE_MISSION";