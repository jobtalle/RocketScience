import {Menu} from "./menu";
import {Editor} from "./editor/editor";
import {World} from "./world/world";
import {Pcb} from "./pcb/pcb";
import {Terrain} from "./world/terrain/terrain";

/**
 * This class contains the game views.
 * @param {Myr} myr A constructed Myriad engine.
 * @param {Sprites} sprites All sprites.
 * @param {Object} overlay The HTML overlay div.
 * @constructor
 */
export function Game(myr, sprites, overlay) {
    let _menu = new Menu(this);
    let _world = null;
    let _editor = null;
    let _hiddenEditor = null;

    const update = timeStep => {
        if (_editor)
            _editor.update(timeStep);

        if (_world)
            _world.update(timeStep);
    };

    const render = () => {
        myr.bind();
        myr.clear();

        if(_world)
            _world.draw();

        if(_editor)
            _editor.draw();

        myr.flush();
    };

    const toggleEdit = () => {
        if (_editor) {
            _hiddenEditor = _editor;
            _editor.hide();
            _editor = null;
            _world.activate();
        }
        else {
            _editor = _hiddenEditor;
            _world.deactivate();
            _editor.show();
        }
    };

    const makeInterface = () => {
        return {
            toggleEdit: toggleEdit
        };
    };

    /**
     * Stop any running game mode.
     */
    this.stop = () => {
        if (_world) {
            _world.free();
            _world = null;
        }

        if (_editor) {
            _editor.free();
            _editor = null;
        }
    };

    /**
     * Start free create mode.
     */
    this.startCreate = () => {
        stop();

        _world = new World(myr, sprites, myr.getWidth(), myr.getHeight());
        _editor = new Editor(myr, sprites, overlay, _world, myr.getWidth(), myr.getHeight(), makeInterface());

        const pcb = new Pcb(myr, sprites);
        pcb.initialize();

        _editor.edit(pcb, 50, -pcb.getHeight() * Terrain.METERS_PER_PIXEL * Pcb.PIXELS_PER_POINT - 2);
        _editor.show();
    };

    /**
     * Start a challenge.
     */
    this.startChallenge = () => {
        stop();
    };

    /**
     * Press the mouse.
     */
    this.onMousePress = () => {
        if(_editor)
            _editor.onMousePress();
        else
            _world.onMousePress();
    };

    /**
     * Release the mouse.
     */
    this.onMouseRelease = () => {
        if(_editor)
            _editor.onMouseRelease();
        else if (_world)
            _world.onMouseRelease();
    };

    /**
     * Move the mouse.
     * @param {Number} x The mouse x position in pixels.
     * @param {Number} y The mouse y position in pixels.
     */
    this.onMouseMove = (x, y) => {
        if (_editor)
            _editor.onMouseMove(x, y);
        else if (_world)
            _world.onMouseMove(x, y);
    };

    /**
     * The mouse enters.
     */
    this.onMouseEnter = () => {
        if (_editor)
            _editor.onMouseEnter();
    };

    /**
     * The mouse leaves.
     */
    this.onMouseLeave = () => {
        if (_editor)
            _editor.onMouseLeave();
    };

    /**
     * When zooming in.
     */
    this.onZoomIn = () => {
        if (!_editor)
            _world.zoomIn();
        else
            _editor.zoomIn();
    };

    /**
     * When zooming out.
     */
    this.onZoomOut = () => {
        if (!_editor)
            _world.zoomOut();
        else
            _editor.zoomOut();
    };

    /**
     * A key is pressed.
     * @param {String} key A key.
     * @param {Boolean} control Indicates whether the control button is pressed.
     */
    this.onKeyDown = (key, control) => {
        if(_editor)
            _editor.onKeyDown(key, control);
        else {
            // TODO: All events must go through buttons! Key presses should always be shortcuts for buttons.
            switch (key) {
                case Game.KEY_TOGGLE_EDIT:
                    toggleEdit();
                    break;
                default:


                    break;
            }
        }
    };

    /**
     * A key is released.
     * @param {String} key A key.
     */
    this.onKeyUp = key => {

    };

    myr.utils.loop(function(timeStep) {
        update(timeStep);
        render();

        return true;
    });

    _menu.show(overlay);
}

Game.KEY_TOGGLE_EDIT = " ";