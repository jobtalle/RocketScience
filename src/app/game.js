import {Menu} from "./gui/menu/menu";
import {Editor} from "./gui/editor/editor";
import {World} from "./world/world";
import {Hud} from "./gui/hud/hud";
import {MissionProgress} from "./mission/missionProgress";

/**
 * This class contains the game views.
 * @param {RenderContext} renderContext A render context.
 * @param {Input} input An input controller.
 * @param {User} user The user of the system.
 * @constructor
 */
export function Game(renderContext, input, user) {
    let _mode = Game.MODE_NONE;
    let _menu = new Menu(this, renderContext.getOverlay(), user);
    let _world = null;
    let _editor = null;
    let _hud = null;

    const update = timeStep => {
        switch (_mode) {
            case Game.MODE_EDIT:
                _world.update(timeStep);
                _editor.update(timeStep);

                break;
            case Game.MODE_GAME:
                _world.update(timeStep);

                break;
        }
    };

    const render = () => {
        renderContext.getMyr().bind();
        renderContext.getMyr().clear();

        switch (_mode) {
            case Game.MODE_EDIT:
                _world.draw();
                _editor.draw();

                break;
            case Game.MODE_GAME:
                _world.draw();

                break;
        }

        renderContext.getMyr().flush();
    };

    const onKeyEvent = event => {
        switch (_mode) {
            case Game.MODE_MENU:
                if (event.down) if (event.key === "Escape")
                    _menu.goBack();

                break;
            case Game.MODE_EDIT:
                _editor.onKeyEvent(event);

                break;
            case Game.MODE_GAME:
                _world.onKeyEvent(event);

                if (event.down) if (event.key === Game.KEY_TOGGLE_EDIT) {
                    if (_mode === Game.MODE_GAME)
                        this.setMode(Game.MODE_EDIT);
                    return;
                }

                break;
        }
    };

    const onMouseEvent = event => {
        switch (_mode) {
            case Game.MODE_EDIT:
                _editor.onMouseEvent(event);

                break;
            case Game.MODE_GAME:
                _world.onMouseEvent(event);

                break;
        }
    };

    const saveMissionProgress = () => {
        if (!_world.getMission().isEdited()) // Nothing is changed.
            return;

        user.saveMissionProgress(new MissionProgress(_world.getMission(),
            _world.getMission().isCompleted() ? MissionProgress.PROGRESS_COMPLETE : MissionProgress.PROGRESS_INCOMPLETE,
            _world.getMissionProgress().getFileName()),
            (result) => null);

    };

    const unsetMode = mode => {
        switch(mode) {
            case Game.MODE_MENU:
                _menu.hide();

                break;
            case Game.MODE_EDIT:
                saveMissionProgress();

                _editor.hide();

                break;
            case Game.MODE_GAME:
                saveMissionProgress();

                _hud.hide();
                _world.deactivate();

                break;
        }
    };

    const stopMission = () => {
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
    };

    /**
     * Set the game mode.
     * @param {Object} mode A valid game mode.
     */
    this.setMode = mode => {
        unsetMode(_mode);

        switch(mode) {
            case Game.MODE_MENU:
                _menu.show();

                break;
            case Game.MODE_EDIT:
                _editor.show();

                break;
            case Game.MODE_GAME:
                _hud.show();

                if (_editor.getEditable() === null)
                    _world.activate(-1);
                else
                    _world.activate(_editor.getEditables().indexOf(_editor.getEditable()));

                break;
        }

        _mode = mode;
    };

    /**
     * Start free create mode.
     */
    this.startCreate = () => {

    };

    /**
     * Start a mission.
     * @param {MissionProgress} missionProgress A mission progress with a to play.
     */
    this.startMission = missionProgress => {
        stopMission();

        _world = new World(renderContext, missionProgress);
        _hud = new Hud(renderContext, _world, this);
        _editor = new Editor(renderContext, _world, this, user, Game.IS_MISSION_EDITOR_MODE);

        _editor.edit(_world.getMission().getEditables()[0]);
        _editor.show();

        this.setMode(Game.MODE_EDIT);
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
    };

    renderContext.getMyr().utils.loop(function(timeStep) {
        update(timeStep);
        render();

        return true;
    });

    input.getKeyboard().addListener(onKeyEvent);
    input.getMouse().addListener(onMouseEvent);

    this.setMode(Game.MODE_MENU);
}

Game.KEY_TOGGLE_EDIT = " ";
Game.IS_MISSION_EDITOR_MODE = true;
Game.MODE_MENU = 0;
Game.MODE_EDIT = 1;
Game.MODE_GAME = 2;
Game.MODE_NONE = 3;