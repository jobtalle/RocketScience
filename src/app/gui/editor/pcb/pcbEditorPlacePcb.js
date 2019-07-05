import {PcbRenderer} from "../../../pcb/pcbRenderer";
import {StyleUtils} from "../../../utils/styleUtils";
import {Scale} from "../../../world/scale";
import * as Myr from "myr.js";

export function PcbEditorPlacePcb(renderContext, editable, selectedPcb, cursor, editor, placedPcb) {
    let _mouseLeftScreen = true;
    const _renderer = new PcbRenderer(renderContext, placedPcb, PcbRenderer.LEVEL_BOARD);
    const _marginLeft = Math.floor(placedPcb.getWidth() / 2);
    const _marginRight = Math.round(placedPcb.getWidth() / 2);
    const _marginUp = Math.floor(placedPcb.getHeight() / 2);
    const _marginDown = Math.round(placedPcb.getHeight() / 2);
    let _suitable = false;

    const doesPcbFitInRegion = (width, height, regionSize) => {
        return width <= regionSize.x * Scale.POINTS_PER_METER && height <= regionSize.y * Scale.POINTS_PER_METER;
    };

    const isPcbInRegion = (region) => {
        const x = cursor.x + editable.getOffset().x * Scale.POINTS_PER_METER;
        const y = cursor.y + editable.getOffset().y * Scale.POINTS_PER_METER;

        return (x - _marginLeft >= 0 &&
                x + _marginRight <= region.getSize().x * Scale.POINTS_PER_METER &&
                y - _marginUp >= 0 &&
                y + _marginDown <= region.getSize().y * Scale.POINTS_PER_METER);
    };

    const isPcbOverlapping = () => {
        if (selectedPcb.getPointCount() < placedPcb.getPointCount()) {
            return selectedPcb.doesOverlapWith(placedPcb,
                cursor.x - _marginLeft, cursor.y - _marginUp);
        }
        else {
            return placedPcb.doesOverlapWith(selectedPcb,
                -(cursor.x - _marginLeft), -(cursor.y - _marginUp));
        }
    };

    // TODO: add pcbEditor set to overlap (add boolean) Add check for overlapping pcb and addhesive to pcb

    /**
     * Change the PCB being edited.
     * @param {Pcb} newPcb The new PCB to edit.
     */
    this.updatePcb = newPcb => {
        selectedPcb = newPcb;
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
        if (!_mouseLeftScreen) {
            _suitable = true;
            editor.setPcbOverlapping(false);

            if (!(doesPcbFitInRegion(placedPcb.getWidth(), placedPcb.getHeight(), editable.getRegion().getSize()) &&
                isPcbInRegion(editable.getRegion()))) {
                _suitable = false;
            } else {
                if (isPcbOverlapping()) {
                    editor.setPcbOverlapping(true);
                } else {
                    if (!selectedPcb.canExtendWithPcb(placedPcb, cursor.x - _marginLeft, cursor.y - _marginUp))
                        _suitable = false;
                }
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
        editor.setPcbOverlapping(false);

        if (_suitable) {

            _renderer.free();
            editor.revertEditor();

            return false;
        }
        else {
            _renderer.free();
            editor.revertEditor();
            return false;
        }
    };

    /**
     * Finish the current dragging action.
     */
    this.mouseUp = () => {

    };

    /**
     * Zoom in.
     * @returns {Boolean} A boolean indicating whether this editor handled the action.
     */
    this.zoomIn = () => {

    };

    /**
     * Zoom out.
     * @returns {Boolean} A boolean indicating whether this editor handled the action.
     */
    this.zoomOut = () => {

    };

    /**
     * The mouse enters.
     */
    this.onMouseEnter = () => {
        _mouseLeftScreen = false;
    };

    /**
     * The mouse leaves.
     */
    this.onMouseLeave = () => {
        _mouseLeftScreen = true;
    };

    /**
     * Cancel any actions deviating from this editors base state.
     */
    this.cancelAction = () => {
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
            renderContext.getMyr().setColor(PcbEditorPlacePcb.COLOR_UNSUITABLE);

        _renderer.drawBody((cursor.x - _marginLeft) * Scale.PIXELS_PER_POINT,
            (cursor.y - _marginUp) * Scale.PIXELS_PER_POINT);

        if (!_suitable)
            renderContext.getMyr().setColor(Myr.Color.WHITE);
    }
}

PcbEditorPlacePcb.COLOR_UNSUITABLE = StyleUtils.getColorHex("--game-color-pcb-edit-place-unsuitable");