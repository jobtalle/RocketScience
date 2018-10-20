import {Menu} from "./menu/menu";
import {Editor} from "./gui/editor/editor";
import {World} from "./world/world";
import {Pcb} from "./pcb/pcb";
import {Terrain} from "./world/terrain/terrain";
import {Objective} from "./mission/objective";
import {Led} from "./part/parts/led";
import {GoalPinState} from "./mission/goal/goalPinState";
import {Mission} from "./mission/mission";
import {Hud} from "./gui/hud/hud";
import {Switch} from "./part/parts/switch";

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
    let _hud = null;
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
            _editor.hide();
            _hud.show();
            _world.activate();

            _hiddenEditor = _editor;
            _editor = null;
        }
        else {
            _editor = _hiddenEditor;
            _hud.hide();
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

        if (_hud) {
            _hud.free();
            _hud = null;
        }

        input.getKeyboard().removeListener(onKeyEvent);
        input.getMouse().removeListener(onMouseEvent);
    };

    /**
     * Start free create mode.
     */
    this.startCreate = () => {
        stop();

        _world = new World(renderContext, new Mission([
            new Objective([new GoalPinState("Led", Led.PIN_INDEX_POWER, 1)], "Light up a LED"),
            new Objective([new GoalPinState("Switch", Switch.PIN_INDEX_OUT, 1)], "Turn a switch on")
        ], "Mission 1"));
        _hud = new Hud(renderContext, _world, this);
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