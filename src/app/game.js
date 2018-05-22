import {Menu} from "./menu";
import {Editor} from "./editor/editor";
import {World} from "./world/world";
import {Pcb} from "./pcb"

/**
 * This class contains the game views.
 * @param {Object} myr A constructed Myriad engine.
 * @param {Object} sprites All sprites.
 * @param {Object} overlay The HTML overlay div.
 * @constructor
 */
export function Game(myr, sprites, overlay) {
    let _menu = new Menu(this);
    let _world = null;
    let _editor = null;

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
        _editor = new Editor(myr, myr.getWidth(), myr.getHeight());
        _editor.edit(new Pcb(myr, sprites));
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

    };

    /**
     * Release the mouse.
     * @param {Number} x The mouse x position in pixels.
     * @param {Number} y The mouse y position in pixels.
     */
    this.onMouseRelease = (x, y) => {

    };

    /**
     * Move the mouse.
     * @param {Number} x The mouse x position in pixels.
     * @param {Number} y The mouse y position in pixels.
     */
    this.onMouseMove = (x, y) => {

    };

    myr.utils.loop(function(timeStep) {
        update(timeStep);
        render();

        return true;
    });

    _menu.show(overlay);
};