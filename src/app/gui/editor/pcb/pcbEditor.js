import {Terrain} from "../../../world/terrain/terrain";
import {World} from "../../../world/world";
import {Pcb} from "../../../pcb/pcb";
import {PcbRenderer} from "../../../pcb/pcbRenderer";
import {View} from "../../../view/view";
import {PcbEditorPlace} from "./pcbEditorPlace";
import {PcbEditorSelect} from "./pcbEditorSelect";
import {PcbEditorReshape} from "./pcbEditorReshape";
import {Selection} from "./selection";
import {PcbEditorEtch} from "./pcbEditorEtch";
import {Editor} from "../editor";
import Myr from "../../../../lib/myr.js";
import {PcbFile} from "../../../pcb/pcbFile";
import {PcbEditorMove} from "./pcbEditorMove";

/**
 * The interactive PCB editor which takes care of sizing & modifying a Pcb.
 * @param {RenderContext} renderContext A render context.
 * @param {World} world A world instance to interact with.
 * @param {View} view A View instance.
 * @param {Number} width The editor width.
 * @param {Number} height The editor height.
 * @param {Number} x The X position of the editor view in pixels.
 * @param {Editor} editor An Editor object.
 * @constructor
 */
export function PcbEditor(renderContext, world, view, width, height, x, editor) {
    const KEY_UNDO = "z";
    const KEY_REDO = "y";
    const KEY_SAVE = "q";

    const _cursor = new Myr.Vector(-1, -1);

    let _editable = null;
    let _renderer = null;
    let _editor = null;
    let _stashedEditor = null;
    let _hover = true;

    const matchWorldPosition = () => {
        world.getView().focus(
            view.getFocusX() + _editable.getPosition().x * Terrain.PIXELS_PER_METER - x * 0.5 / view.getZoom(),
            view.getFocusY() + _editable.getPosition().y * Terrain.PIXELS_PER_METER,
            view.getZoom());
    };

    const updateCursor = () => {
        const oldX = _cursor.x;
        const oldY = _cursor.y;

        _cursor.x = view.getMouse().x;
        _cursor.y = view.getMouse().y;

        view.getInverse().apply(_cursor);

        _cursor.x = Math.floor(_cursor.x / Pcb.PIXELS_PER_POINT);
        _cursor.y = Math.floor(_cursor.y / Pcb.PIXELS_PER_POINT);

        return _cursor.x !== oldX || _cursor.y !== oldY;
    };

    const moveCursor = () => {
        if (!_editor)
            return;

        _editor.moveCursor();
    };

    const mouseDown = (x, y) => {
        if (!_editor)
            return false;

        return _editor.mouseDown(x, y);
    };

    const mouseUp = (x, y) => {
        if (!_editor)
            return;

        _editor.mouseUp(x, y);
    };

    const updateRenderer = () => {
        let lastLevel;

        if (_renderer)
            lastLevel = _renderer.getLevel();
        else
            lastLevel = PcbRenderer.LEVEL_PARTS;

        _renderer = new PcbRenderer(renderContext, _editable.getPcb(), lastLevel);
    };

    const updatePcb = () => {
        if (_editor)
            _editor.updatePcb(_editable.getPcb());

        if (_stashedEditor)
            _stashedEditor.updatePcb(_editable.getPcb());

        this.revalidate();

        matchWorldPosition();
        updateRenderer();
        moveCursor();
    };

    /**
     * Set X-ray render mode on or off. If turned on, the user will be able to see behind parts.
     * @param {Boolean} xRay A boolean indicating whether to turn X-ray render mode on or off.
     */
    this.setXRay = xRay => {
        if (xRay)
            _renderer.setLevel(PcbRenderer.LEVEL_BOARD);
        else
            _renderer.setLevel(PcbRenderer.LEVEL_PARTS);
    };

    /**
     * Shift the PCB position.
     * @param {Number} dx The horizontal movement in meters.
     * @param {Number} dy The vertical movement in meters.
     */
    this.moveOffset = (dx, dy) => {
        /*
        view.focus(
            view.getFocusX() - dx * Terrain.PIXELS_PER_METER,
            view.getFocusY() - dy * Terrain.PIXELS_PER_METER,
            view.getZoom());
        _editable.moveOffset(
            Math.max(dx, -_editable.getOffset().x),
            Math.max(dy, -_editable.getOffset().y));

        matchWorldPosition();
        */
    };

    /**
     * Set an editor to be active in this PcbEditor.
     * @param {Object} editor One of the valid PCB editor objects.
     */
    this.setEditor = editor => {
        _stashedEditor = _editor;
        _editor = editor;
        _editor.makeActive();

        moveCursor();
    };

    /**
     * Revalidate the editor state and PCB graphics.
     */
    this.revalidate = () => {
        editor.onPcbChange();

        if(_renderer)
            _renderer.revalidate();

        updateCursor();
    };

    /**
     * Revert to the previously active PCB editor.
     * @returns {Object} The previously active PCB editor.
     */
    this.revertEditor = () => {
        this.setEditor(_stashedEditor);

        return _editor;
    };

    /**
     * Get the GUI editor associated with this pcb editor.
     * @returns {Editor} The Editor object.
     */
    this.getEditor = () => editor;

    /**
     * Check if the mouse is hovering over the pcb editor.
     * @returns {boolean} A boolean indicating whether the mouse is hovering over the pcb editor.
     */
    this.getHover = () => _hover;

    /**
     * Set the editors edit mode. Possible options are:
     * PcbEditor.EDIT_MODE_SELECT  for selection dragging.
     * PcbEditor.EDIT_MODE_RESHAPE for PCB reshaping.
     * PcbEditor.EDIT_MODE_ETCH for path etching.
     * @param {Object} mode Any of the valid edit modes.
     */
    this.setEditMode = mode => {
        editor.getInfo().setPinouts(null);
        editor.getOverlay().clearRulers();

        switch (mode) {
            case PcbEditor.EDIT_MODE_RESHAPE:
                this.setEditor(new PcbEditorReshape(renderContext, _editable.getPcb(), _cursor, this));

                break;
            case PcbEditor.EDIT_MODE_SELECT:
                this.setEditor(new PcbEditorSelect(
                    renderContext,
                    _editable.getPcb(),
                    _cursor,
                    this,
                    new Selection(renderContext),
                    _editable.getBudget()));

                break;
            case PcbEditor.EDIT_MODE_ETCH:
                this.setEditor(new PcbEditorEtch(renderContext, _editable.getPcb(), _cursor, this));

                break;
            case PcbEditor.EDIT_MODE_MOVE:
                this.setEditor(new PcbEditorMove(renderContext, _cursor, this));

                break;
        }
    };

    /**
     * Update the state of the PCB editor.
     * @param timeStep The number of seconds passed after the previous update.
     */
    this.update = timeStep => {
        if (!_editor)
            return;

        _editor.update(timeStep);
    };

    /**
     * Draw the PCB editor.
     */
    this.draw = () => {
        renderContext.getMyr().push();
        renderContext.getMyr().translate(renderContext.getViewport().getSplitX(), 0);
        renderContext.getMyr().transform(view.getTransform());

        _renderer.drawBody(0, 0);
        _editor.draw();

        renderContext.getMyr().pop();
    };

    /**
     * Show the PCB editor.
     */
    this.show = () => {
        matchWorldPosition();

        _hover = true;
        _cursor.x = _cursor.y = -1;

        moveCursor();
    };

    /**
     * Hide the PCB editor.
     */
    this.hide = () => {
        view.onMouseRelease();
        _editor.reset();

        // TODO: Add all editable PCB's in the current mission
        world.addPcb(_editable.getPcb(), _editable.getPosition().x, _editable.getPosition().y);
    };

    /**
     * Start placing one or more parts.
     * @param {Array} fixtures An array of valid PcbEditorPlace.Fixture instances to place on the PCB.
     */
    this.place = fixtures => {
        _editor.reset();

        this.setEditor(new PcbEditorPlace(renderContext, _editable.getPcb(), _cursor, this, fixtures, null));
    };

    /**
     * Start editing a pcb.
     * @param {Editable} editable An editable.
     */
    this.edit = editable => {
        if (_renderer) {
            _renderer.free();

            const dx = (_editable.getRegion().getOrigin().x - editable.getRegion().getOrigin().x) * Terrain.PIXELS_PER_METER;
            const dy = (_editable.getRegion().getOrigin().y - editable.getRegion().getOrigin().y) * Terrain.PIXELS_PER_METER;

            view.focus(
                view.getFocusX() - dx,
                view.getFocusY() - dy,
                view.getZoom());
        }
        else
            view.focus(
                editable.getPcb().getWidth() * 0.5 * Pcb.PIXELS_PER_POINT,
                editable.getPcb().getHeight() * 0.5 * Pcb.PIXELS_PER_POINT,
                Editor.ZOOM_DEFAULT);

        _editable = editable;

        updatePcb();
    };

    /**
     * Get the current editable object.
     * @returns {Editable} The editable.
     */
    this.getEditable = () => _editable;

    /**
     * Get the PCB editor width
     * @returns {Number} The width of the editor in pixels.
     */
    this.getWidth = () => width;

    /**
     * Press the mouse.
     * @param {Number} x The mouse x position in pixels.
     * @param {Number} y The mouse y position in pixels.
     */
    this.onMousePress = (x, y) => {
        if (!mouseDown(x, y)) {
            view.onMouseMove(x, y);
            view.onMousePress();
        }
    };

    /**
     * Release the mouse.
     * @param {Number} x The mouse x position in pixels.
     * @param {Number} y The mouse y position in pixels.
     */
    this.onMouseRelease = (x, y) => {
        mouseUp(x, y);

        view.onMouseRelease();
    };

    /**
     * Move the mouse.
     * @param {Number} x The mouse x position in pixels.
     * @param {Number} y The mouse y position in pixels.
     */
    this.onMouseMove = (x, y) => {
        if (!_hover)
            return;

        view.onMouseMove(x, y);

        if (view.isDragging())
            matchWorldPosition();

        if (updateCursor())
            moveCursor();

        if (_editor)
            _editor.mouseMove(x, y);
    };

    /**
     * The mouse enters.
     * @param {Number} x The mouse x position in pixels.
     * @param {Number} y The mouse y position in pixels.
     */
    this.onMouseEnter = (x, y) => {
        _hover = true;

        if (_editor)
            _editor.onMouseEnter();

        this.onMouseMove(x, y);
    };

    /**
     * The mouse leaves.
     */
    this.onMouseLeave = () => {
        _hover = false;

        if (!_editor)
            return;

        _editor.onMouseLeave();

        _cursor.x = _cursor.y = -1;
        _editor.moveCursor();

        view.onMouseRelease();
    };

    /**
     * Zoom in.
     * @param {Number} x The mouse x position in pixels.
     * @param {Number} y The mouse y position in pixels.
     */
    this.zoomIn = (x, y) => {
        if (_editor.zoomIn())
            return;

        view.onMouseMove(x, y);
        view.zoomIn();

        matchWorldPosition();
    };

    /**
     * Zoom out.
     * @param {Number} x The mouse x position in pixels.
     * @param {Number} y The mouse y position in pixels.
     */
    this.zoomOut = (x, y) => {
        if (_editor.zoomOut())
            return;

        view.onMouseMove(x, y);
        view.zoomOut();

        matchWorldPosition();
    };

    /**
     * A key event has been fired.
     * @param {KeyEvent} event A key event.
     */
    this.onKeyEvent = event => {
        if (event.down) switch(event.key) {
            case KEY_UNDO:
                if (event.control) if (_editable.undoPop()) {
                    updatePcb();

                    matchWorldPosition();
                }

                return;
            case KEY_REDO:
                if (event.control) if (_editable.redoPop()) {
                    updatePcb();

                    matchWorldPosition();
                }

                return;
            case KEY_SAVE:
                if (event.control)
                    _editable.setPcb(PcbFile.fromPcb(_editable.getPcb()).decode()), updatePcb();

                return;
        }

        _editor.onKeyEvent(event);
    };

    /**
     * Free all resources occupied by this editor.
     */
    this.free = () => {
        if (_renderer)
            _renderer.free();
    };
}

PcbEditor.EDIT_MODE_SELECT = 0;
PcbEditor.EDIT_MODE_RESHAPE = 1;
PcbEditor.EDIT_MODE_ETCH = 2;
PcbEditor.EDIT_MODE_MOVE = 3;