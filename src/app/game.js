import {Menu} from "./menu/menu";
import {Editor} from "./editor/editor";
import {World} from "./world/world";
import {Pcb} from "./pcb/pcb";
import {Terrain} from "./world/terrain/terrain";

/**
 * This class contains the game views.
 * @param {RenderContext} renderContext A render context.
 * @constructor
 */
export function Game(renderContext) {
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
        renderContext.getMyr().bind();
        renderContext.getMyr().clear();

        if(_world)
            _world.draw();

        if(_editor)
            _editor.draw();

        renderContext.getMyr().flush();
    };

    /**
     * Toggle between editing and running the simulation.
     */
    this.toggleEdit = () => {
        if (_editor) {
            _hiddenEditor = _editor;
            _editor.hide();
            _editor = null;
            _world.activate();
        }
        else {
            _editor = _hiddenEditor;
            _hiddenEditor = null;
            _world.deactivate();
            _editor.show();
        }
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

        _world = new World(renderContext);
        _editor = new Editor(renderContext, _world, this);

        const pcb = new Pcb();
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
     * Call after the render context has resized.
     * @param {Number} width The width in pixels.
     * @param {Number} height The height in pixels.
     */
    this.resize = (width, height) => {
        if (_world)
            _world.resize(width, height);

        if (_editor)
            _editor.resize(width, height);

        if (_hiddenEditor)
            _hiddenEditor.resize(width, height);
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
                    this.toggleEdit();
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

    renderContext.getMyr().utils.loop(function(timeStep) {
        update(timeStep);
        render();

        return true;
    });

    _menu.show(renderContext.getOverlay());
}

Game.KEY_TOGGLE_EDIT = " ";