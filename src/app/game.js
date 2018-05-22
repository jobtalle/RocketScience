import {Menu} from "./menu";
import {Editor} from "./editor/editor";
import {World} from "./world/world";

/**
 * This class contains the game views.
 * @param {Object} myr A constructed Myriad engine.
 * @param {Object} sprites All sprites.
 * @param {Object} overlay The HTML overlay div.
 * @constructor
 */
export function Game(myr, sprites, overlay) {
    const View = function(view) {
        this.update = timeStep => view.update(timeStep);
        this.render = () => view.render();
        this.draw = () => view.draw();
    };

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
        if(_world)
            _world.render();

        if(_editor)
            _editor.render();

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
        _world = new View(new World(myr, sprites, myr.getWidth(), myr.getHeight()), 0, 0);
        _editor = new View(new Editor(myr, sprites, myr.getWidth(), myr.getHeight()), 0, 0);
    };

    /**
     * Start a challenge.
     */
    this.startChallenge = () => {

    };

    myr.utils.loop(function(timeStep) {
        update(timeStep);
        render();

        return true;
    });

    _menu.show(overlay);
};