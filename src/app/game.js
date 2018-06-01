import {Menu} from "./menu";
import {Editor} from "./editor/editor";
import {World} from "./world/world";
import {Pcb} from "./pcb/pcb"

/**
 * This class contains the game views.
 * @param {Object} myr A constructed Myriad engine.
 * @param {Object} sprites All sprites.
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
        if(_world)
            _world.update(timeStep);

        if(_editor)
            _editor.update(timeStep);
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
        _editor = new Editor(myr, sprites, overlay, myr.getWidth(), myr.getHeight());

        const pcb = new Pcb(myr, sprites);
        pcb.initialize();

        _editor.edit(pcb);
        _editor.show();
    };

    /**
     * Start a challenge.
     */
    this.startChallenge = () => {

    };

    /**
     * Press the mouse.
     * @param {Number} x The mouse x position in pixels.
     * @param {Number} y The mouse y position in pixels.
     */
    this.onMousePress = (x, y) => {
        if(_editor)
            _editor.onMousePress(x, y);
    };

    /**
     * Release the mouse.
     * @param {Number} x The mouse x position in pixels.
     * @param {Number} y The mouse y position in pixels.
     */
    this.onMouseRelease = (x, y) => {
        if(_editor)
            _editor.onMouseRelease(x, y);
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
     * @param {Number} x The mouse x position in pixels.
     * @param {Number} y The mouse y position in pixels.
     */
    this.onMouseEnter = (x, y) => {

    };

    /**
     * The mouse leaves.
     * @param {Number} x The mouse x position in pixels.
     * @param {Number} y The mouse y position in pixels.
     */
    this.onMouseLeave = (x, y) => {

    };

    /**
     * When zooming in.
     */
    this.onZoomIn = () => {
        if (!_editor)
            _world.zoomIn();
    };

    /**
     * When zooming out.
     */
    this.onZoomOut = () => {
        if (!_editor)
            _world.zoomOut();
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
                }
                else {
                    _editor = _hiddenEditor;
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