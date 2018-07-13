import {Menu} from "./menu";
import {Editor} from "./editor/editor";
import {World} from "./world/world";
import {Pcb} from "./pcb/pcb";
import {Terrain} from "./world/terrain";

/**
 * This class contains the game views.
 * @param {Myr} myr A constructed Myriad engine.
 * @param {Sprites} sprites All sprites.
 * @param {Object} overlay The HTML overlay div.
 * @constructor
 */
export function Game(myr, sprites, overlay) {
    const KEY_TOGGLE_EDIT = " ";

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

    /**
     * Start free create mode.
     */
    this.startCreate = () => {
        _world = new World(myr, sprites, myr.getWidth(), myr.getHeight());
        _editor = new Editor(myr, sprites, overlay, _world, myr.getWidth(), myr.getHeight());

        const pcb = new Pcb(myr, sprites);
        pcb.initialize();

        _editor.edit(pcb, 50, -pcb.getHeight() * Terrain.METERS_PER_PIXEL * Pcb.PIXELS_PER_POINT);
        _editor.show();
    };

    /**
     * Start a challenge.
     */
    this.startChallenge = () => {

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
        else
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
        else
            _world.onMouseMove(x, y);
    };

    /**
     * The mouse enters.
     */
    this.onMouseEnter = () => {

    };

    /**
     * The mouse leaves.
     */
    this.onMouseLeave = () => {

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
        switch(key) {
            case KEY_TOGGLE_EDIT:
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
                break;
        }

        if(_editor)
            _editor.onKeyDown(key, control);
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