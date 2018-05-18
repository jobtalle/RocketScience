import Menu from "./menu";
import Editor from "./editor/editor";
import World from "./world/world";

/**
 * This class contains the game views.
 * @param {Object} myr A constructed Myriad engine.
 * @param {Object} overlay The HTML overlay div
 * @constructor
 */
export default function Game(myr, overlay) {
    const View = function(view, x, y) {
        this.update = timeStep => view.update(timeStep);
        this.render = () => view.render();
        this.draw = () => view.draw(x, y);
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
        // TODO: Manage view dimensions properly
        _editor = new View(new Editor(myr, 300, myr.getHeight()), 0, 0);
        _world = new View(new World(myr, myr.getWidth() - 300, myr.getHeight()), 300, 0);
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