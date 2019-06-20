import {PartRenderer} from "../../../part/partRenderer";
import {Pcb} from "../../../pcb/pcb";
import {Part} from "../../../part/part";
import "../../../part/objects"
import {Selection} from "./selection";
import {PcbEditorSelect} from "./pcbEditorSelect";
import {Scale} from "../../../world/scale";
import Myr from "myr.js"
import {StyleUtils} from "../../../utils/styleUtils";

/**
 * A placement editor used to place a part on a pcb.
 * @param {RenderContext} renderContext A render context.
 * @param {Pcb} pcb The PCB currently being edited.
 * @param {Myr.Vector} cursor The cursor position in cells.
 * @param {PcbEditor} editor A PCB editor.
 * @param {Array} fixtures An array of valid PcbEditorPlace.Fixture instances to place on the PCB.
 * @param {Selection} selection An optional selection which will be reinstated when placement has succeeded.
 * @constructor
 */
export function PcbEditorPlace(renderContext, pcb, cursor, editor, fixtures, selection) {
    const _lastCursor = cursor.copy();
    const _renderers = [];

    let _configurationIndex = 0;
    let _suitable = false;

    const makeRenderers = () => {
        _renderers.splice(0, _renderers.length);

        for (const fixture of fixtures) {
            if (fixture.isInstance())
                _renderers.push(new PartRenderer(renderContext, fixture.part.getConfiguration()));
            else
                _renderers.push(new PartRenderer(renderContext, fixture.part.configurations[_configurationIndex]));
        }
    };

    const getConfigurationCount = () => {
        if (fixtures.length > 1)
            return 1;

        const fixture = fixtures[0];

        if (fixture.isInstance())
            return fixture.part.getDefinition().configurations.length;
        else
            return fixture.part.configurations.length;
    };

    const canReconfigure = () => !selection;

    const nextConfiguration = () => {
        _configurationIndex = (_configurationIndex + 1) % getConfigurationCount();

        makeRenderers();
        this.moveCursor();
    };

    const previousConfiguration = () => {
        if (--_configurationIndex === -1)
            _configurationIndex = getConfigurationCount() - 1;

        makeRenderers();
        this.moveCursor();
    };

    const getConfiguration = fixture => {
        if (fixture.isInstance())
            return fixture.part.getConfiguration();
        else
            return fixture.part.configurations[_configurationIndex];
    };

    /**
     * Change the PCB being edited.
     * @param {Pcb} newPcb The new PCB to edit.
     */
    this.updatePcb = newPcb => {
        pcb = newPcb;
    };

    /**
     * A key event has been fired.
     * @param {KeyEvent} event A key event.
     */
    this.onKeyEvent = event => {

    };

    /**
     * Tell the editor the cursor has moved.
     */
    this.moveCursor = () => {
        _suitable = true;

        for (const fixture of fixtures) {
            if (!pcb.fits(cursor.x + fixture.x, cursor.y + fixture.y, getConfiguration(fixture))) {
                _suitable = false;

                break;
            }
        }

        if (selection) {
            if (!_lastCursor.equals(cursor)) {
                selection.move(cursor.x - _lastCursor.x, cursor.y - _lastCursor.y);

                _lastCursor.x = cursor.x;
                _lastCursor.y = cursor.y;
            }
        }
    };

    /**
     * Tell the editor the mouse has moved.
     * @param {Number} x The mouse position on the screen in pixels.
     * @param {Number} y The mouse position on the screen in pixels.
     */
    this.mouseMove = (x, y) => {

    };

    /**
     * Start dragging action.
     * @returns {Boolean} A boolean indicating whether a drag event has started.
     */
    this.mouseDown = () => {
        if (_suitable) {
            if (selection)
                selection.clearSelected();
            else
                editor.getUndoStack().push();

            const pcbFixtures = [];

            for (const fixture of fixtures) {
                let part = null;

                if (fixture.isInstance())
                    part = new Part(
                        fixture.part.getDefinition(),
                        fixture.part.getConfigurationIndex());
                else
                    part = new Part(
                        fixture.part,
                        _configurationIndex);

                const pcbFixture = pcb.place(
                    part,
                    cursor.x + fixture.x,
                    cursor.y + fixture.y);

                if (selection)
                    selection.addSelected(pcbFixture);
                else
                    pcbFixtures.push(pcbFixture);
            }

            editor.revalidate();

            const revertEditor = editor.revertEditor();

            if (!selection && revertEditor instanceof PcbEditorSelect)
                revertEditor.select(pcbFixtures);

            return true;
        }
        else {
            if (selection !== null)
                selection.clearSelected();

            editor.revertEditor();

            return false;
        }
    };

    /**
     * Finish the current dragging action.
     */
    this.mouseUp = () => {
        this.mouseDown();
    };

    /**
     * Zoom in.
     * @returns {Boolean} A boolean indicating whether this editor handled the action.
     */
    this.zoomIn = () => {
        if (!canReconfigure())
            return false;

        nextConfiguration();

        return true;
    };

    /**
     * Zoom out.
     * @returns {Boolean} A boolean indicating whether this editor handled the action.
     */
    this.zoomOut = () => {
        if (!canReconfigure())
            return false;

        previousConfiguration();

        return true;
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
     * Cancel any actions deviating from this editors base state.
     */
    this.cancelAction = () => {
        if (selection !== null)
            selection.clearSelected();

        editor.revertEditor();
    };

    /**
     * Reset the editor's current state.
     */
    this.reset = () => {
        this.cancelAction();
    };

    /**
     * Update this editor.
     * @param {Number} timeStep The time passed since the last update in seconds.
     */
    this.update = timeStep => {

    };

    /**
     * Make this editor active.
     */
    this.makeActive = () => {

    };

    /**
     * Draw this editor.
     */
    this.draw = () => {
        if (!editor.getHover())
            return;

        if (!_suitable)
            renderContext.getMyr().setColor(PcbEditorPlace.COLOR_UNSUITABLE);

        for (let i = 0; i < fixtures.length; ++i) {
            _renderers[i].drawInternal(
                (cursor.x + fixtures[i].x) * Scale.PIXELS_PER_POINT,
                (cursor.y + fixtures[i].y) * Scale.PIXELS_PER_POINT);
            _renderers[i].drawExternal(
                (cursor.x + fixtures[i].x) * Scale.PIXELS_PER_POINT,
                (cursor.y + fixtures[i].y) * Scale.PIXELS_PER_POINT);
        }

        if (!_suitable)
            renderContext.getMyr().setColor(Myr.Color.WHITE);

        if (selection !== null)
            selection.draw();
    };

    if (fixtures.length === 1 && fixtures[0].isInstance())
        _configurationIndex = fixtures[0].part.getConfigurationIndex();

    makeRenderers();
}

/**
 * A part to place with an offset.
 * @param {Object} part Either a part definition as defined in parts.json or a Part instance.
 * @param {Number} x The X offset.
 * @param {Number} y The Y offset.
 * @constructor
 */
PcbEditorPlace.Fixture = function(part, x, y) {
    this.part = part;
    this.x = x;
    this.y = y;
};

PcbEditorPlace.Fixture.prototype.isInstance = function() {
    return this.part.configurations === undefined;
};

PcbEditorPlace.COLOR_UNSUITABLE = StyleUtils.getColor("--game-color-pcb-edit-place-unsuitable");