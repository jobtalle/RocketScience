import {PcbRenderer} from "../../pcb/pcbRenderer";
import {Scale} from "../../world/scale";
import Myr from "myr.js"
import {getValidOrigin} from "../../mission/editable/editableEscaper";

/**
 * The editables in the world that may be edited.
 * @param {Editor} editor The editing context.
 * @param {RenderContext} renderContext A render context.
 * @param {World} world A world instance to interact with.
 * @constructor
 */
export function Editables(editor, renderContext, world) {
    const Entry = function(editable) {
        const _renderer = new PcbRenderer(renderContext, editable.getPcb(), PcbRenderer.LEVEL_HULL);
        let _grid = null;
        let _border = null;
        let _lastSize = editable.getRegion().getSize().copy();

        const makeGrid = () => {
            if (_grid)
                _grid.free();

            _grid = new (renderContext.getMyr().Surface)(
                Math.ceil(editable.getRegion().getSize().x * Scale.PIXELS_PER_METER),
                Math.ceil(editable.getRegion().getSize().y * Scale.PIXELS_PER_METER));

            _grid.setClearColor(new Myr.Color(1, 1, 1, 0));
            _grid.bind();

            for (let x = 0; x < _grid.getWidth(); x += _spriteGrid.getWidth())
                for (let y = 0; y < _grid.getHeight(); y += _spriteGrid.getHeight())
                    _spriteGrid.draw(x, y);
        };

        const makeBorder = () => {
            if (_border)
                _border.free();

            _border = new (renderContext.getMyr().Surface)(
                Math.ceil(editable.getRegion().getSize().x * Scale.PIXELS_PER_METER),
                Math.ceil(editable.getRegion().getSize().y * Scale.PIXELS_PER_METER));

            _border.bind();

            renderContext.getMyr().primitives.drawRectangle(
                Editables.BORDER_COLOR,
                1,
                1,
                _border.getWidth() -1,
                _border.getHeight() - 1);
        };

        const resize = () => {
            makeGrid();
            makeBorder();

            renderContext.getMyr().bind();
        };

        /**
         * Get the editable object of the entry
         * @returns {Editable}
         */
        this.getEditable = () => editable;

        /**
         * Draw the editable of the entry
         * @param {Boolean} editing
         */
        this.draw = editing => {
            if (!_lastSize.equals(editable.getRegion().getSize())) {
                _lastSize = editable.getRegion().getSize().copy();

                resize();
            }

            if (editing)
                _grid.draw(
                    editable.getRegion().getOrigin().x * Scale.PIXELS_PER_METER,
                    editable.getRegion().getOrigin().y * Scale.PIXELS_PER_METER);
            else {
                _renderer.drawBody(
                    (editable.getRegion().getOrigin().x + editable.getOffset().x) * Scale.PIXELS_PER_METER,
                    (editable.getRegion().getOrigin().y + editable.getOffset().y) * Scale.PIXELS_PER_METER);
                _border.draw(
                    editable.getRegion().getOrigin().x * Scale.PIXELS_PER_METER,
                    editable.getRegion().getOrigin().y * Scale.PIXELS_PER_METER);
            }
        };

        /**
         * Frees the memory of the OpenGL backend
         */
        this.free = () => {
            _renderer.free();
            _grid.free();
            _border.free();
        };

        resize();
    };

    const _spriteGrid = renderContext.getSprites().getSprite(Editables.SPRITE_GRID);
    const _entries = [];
    let _current = null;

    /**
     * Returns true if coordinates are within editable region.
     * @param {Myr.Vector} at coordinates to check.
     * @param {Editable} editable Editable to check against.
     * @returns {Boolean} True if coordinates are within editable region.
     */
    const containsCoordinates = (at, editable) => {
        return at.x * Scale.METERS_PER_PIXEL >= editable.getRegion().getOrigin().x &&
            at.y * Scale.METERS_PER_PIXEL >= editable.getRegion().getOrigin().y &&
            at.x * Scale.METERS_PER_PIXEL <= editable.getRegion().getOrigin().x + editable.getRegion().getSize().x &&
            at.y * Scale.METERS_PER_PIXEL <= editable.getRegion().getOrigin().y + editable.getRegion().getSize().y;
    };

    /**
     * Draw all editables except for the one currently being edited.
     */
    this.draw = () => {
        for (const entry of _entries)
            entry.draw(entry.getEditable() === _current);
    };

    /**
     * Set the currently being edited editable.
     * @param {Editable} current The currently being edited editable, or null if none is being edited.
     */
    this.setCurrent = current => _current = current;

    /**
     * Get the editable at a certain world position.
     * @param {Number} x The x position in the world in meters.
     * @param {Number} y The y position in the world in meters.
     * @returns {Editable} The editable found at that position, or null if no editable is under it.
     */
    this.getEditableAt = (x, y) => {
        const at = new Myr.Vector(x, y);

        world.getView().getInverse().apply(at);

        if (_current)
            if (containsCoordinates(at, _current))
                return _current;

        for (const editable of world.getMission().getEditables()) {
            if (editable === _current)
                continue;

            if (containsCoordinates(at, editable))
                return editable;
        }

        return null;
    };

    /**
     * Adds an editable to the world, and focuses on it.
     * @param {Editable} editable Editable to add.
     */
    this.addEditable = editable => {
        const newOrigin = getValidOrigin(editable, world.getMission().getEditables());

        editable.moveRegion(newOrigin.x - editable.getRegion().getOrigin().x, newOrigin.y - editable.getRegion().getOrigin().y);

        world.getMission().getEditables().push(editable);

        _entries.push(new Entry(editable));

        editor.edit(editable);
    };

    /**
     * Removes selected editable from the world, and focuses on the first editable of the editable array in Missions.
     * @param {Editable} editable Editable to remove.
     */
    this.removeEditable = editable => {
        if (world.getMission().getEditables().length === 1) {
            // TODO: Notify user that remove fails.
            return;
        }

        const index = world.getMission().getEditables().indexOf(editable);

        if (index > -1) {
            world.getMission().getEditables().splice(index, 1);

            for (const entry of _entries) if (entry.getEditable() === editable) {
                entry.free();
                _entries.splice(_entries.indexOf(entry), 1);

                break;
            }
        }

        editor.edit(world.getMission().getEditables()[world.getMission().getEditables().length - 1]);
    };

    /**
     * Check if anything is edited.
     * @return {Boolean} A boolean indicating if the editables are edited.
     */
    this.isEdited = () => {
        for (const entry of _entries)
            if (entry.getEditable().getUndoStack().isEdited())
                return true;

        return false;
    };

    /**
     * Free all resources maintained by this editables.
     */
    this.free = () => {
        for (const entry of _entries)
            entry.free();
    };

    for (const editable of world.getMission().getEditables())
        _entries.push(new Entry(editable));
}

Editables.SPRITE_GRID = "pcbGrid";
Editables.BORDER_COLOR = Myr.Color.RED;