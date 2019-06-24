import {EditOptionsTerrain} from "../editoptions/editOptionsTerrain";

/**
 * The terrain editor, used for editing terrain.
 * @param {RenderContext} renderContext A render context.
 * @param {PcbEditor} editor A PCB editor.
 * @constructor
 */
export function PcbEditorTerrain(renderContext, editor) {
    let _radius = PcbEditorTerrain.RADIUS_DEFAULT;

    /**
     * Set the brush radius.
     * @param {Number} radius The new radius, which must be a whole positive number.
     */
    this.setRadius = radius => _radius = radius;

    /**
     * Get the brush radius.
     * @returns {Number} The brush radius.
     */
    this.getRadius = () => _radius;

    /**
     * Change the PCB being edited.
     * @param {Pcb} newPcb The new PCB to edit.
     */
    this.updatePcb = newPcb => {

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
    this.zoomIn = () => false;

    /**
     * Zoom out.
     * @returns {Boolean} A boolean indicating whether this editor handled the action.
     */
    this.zoomOut = () => false;

    /**
     * The mouse enters.
     */
    this.onMouseEnter = () => {

    };

    /**
     * The mouse leaves.
     */
    this.onMouseLeave = () => {
        this.cancelAction();
    };

    /**
     * Cancel any actions deviating from this editors base state.
     */
    this.cancelAction = () => {

    };

    /**
     * Reset the editor's current state.
     */
    this.reset = () => {

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

    };

    const _options = new EditOptionsTerrain(this);

    /**
     * Get the EditOptionsTerrain object.
     * @returns {EditOptionsTerrain} The EditOptionsTerrain object.
     */
    this.getOptions = () => _options;
}

PcbEditorTerrain.RADIUS_DEFAULT = 12;