import {Menu} from "./menu/menu";
import {Editor} from "./editor/editor";
import {World} from "./world/world";
import {Pcb} from "./pcb/pcb";
import {Terrain} from "./world/terrain/terrain";

/**
 * This class contains the game views.
 * @param {RenderContext} renderContext A render context.
 * @param {Input} input An input controller.
 * @constructor
 */
export function Game(renderContext, input) {
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

    const onKeyEvent = event => {
        if (event.down) switch (event.key) {
            case Game.KEY_TOGGLE_EDIT:
                this.toggleEdit();

                return;
        }

        if (_editor)
            _editor.onKeyEvent(event);
        else if (_world)
            _world.onKeyEvent(event);
    };

    const onMouseEvent = event => {
        if (_editor)
            _editor.onMouseEvent(event);
        else if (_world)
            _world.onMouseEvent(event);
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

        input.getKeyboard().removeListener(onKeyEvent);
        input.getMouse().removeListener(onMouseEvent);
    };

    /**
     * Start free create mode.
     */
    this.startCreate = () => {
        stop();

        _world = new World(renderContext, input);
        _editor = new Editor(renderContext, _world, this, input);

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

    renderContext.getMyr().utils.loop(function(timeStep) {
        update(timeStep);
        render();

        return true;
    });

    _menu.show(renderContext.getOverlay());

    input.getKeyboard().addListener(onKeyEvent);
    input.getMouse().addListener(onMouseEvent);
}

Game.KEY_TOGGLE_EDIT = " ";