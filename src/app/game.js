/**
 * This class contains the game views.
 * @param {Object} myr A constructed Myriad engine.
 * @constructor
 */
export default function Game(myr) {
    const View = function(view, x, y) {
        this.update = timeStep => view.update(timeStep);
        this.render = () => view.render(x, y);
    };

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
            _world.render();

        if(_editor)
            _editor.render();

        myr.flush();
    };

    myr.utils.loop(function(timeStep) {
        update(timeStep);
        render();

        return true;
    });
};