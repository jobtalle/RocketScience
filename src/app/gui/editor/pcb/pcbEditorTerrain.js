import {EditOptionsTerrain} from "../editoptions/editOptionsTerrain";
import {Terrain} from "../../../world/terrain/terrain";
import {Scale} from "../../../world/scale";
import * as Myr from "myr.js";

/**
 * The terrain editor, used for editing terrain.
 * @param {RenderContext} renderContext A render context.
 * @param {PcbEditor} editor A PCB editor.
 * @param {World} world The World object.
 * @constructor
 */
export function PcbEditorTerrain(renderContext, editor, world) {
    const _worldPosition = new Myr.Vector(0, 0);
    const _spriteElevate = renderContext.getSprites().getSprite(PcbEditorTerrain.SPRITE_ELEVATE);
    let _mode = PcbEditorTerrain.MODE_DEFAULT;
    let _cursor = 0;
    let _radius = PcbEditorTerrain.RADIUS_DEFAULT;

    const drawAnchors = (cursor, radius, sprite) => {
        const min = Math.max(0, cursor - radius);
        const max = Math.min(world.getMission().getTerrain().getHeights().length - 1, cursor + radius);

        for (let segment = min; segment <= max; ++segment)
            sprite.draw(
                segment * Terrain.PIXELS_PER_SEGMENT - sprite.getWidth() * 0.5,
                world.getMission().getTerrain().getHeights()[segment] * Scale.PIXELS_PER_METER - sprite.getHeight() * 0.5);
    };

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
        _worldPosition.x = x + renderContext.getViewport().getSplitX();
        _worldPosition.y = y;

        world.getView().getInverse().apply(_worldPosition);

        _cursor = Math.round(_worldPosition.x / Terrain.PIXELS_PER_SEGMENT);

        if (_cursor < 0)
            _cursor = 0;
        else if (_cursor >= world.getMission().getTerrain().getHeights().length)
            _cursor = world.getMission().getTerrain().getHeights().length - 1;
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
        renderContext.getMyr().pop();
        renderContext.getMyr().push();
        renderContext.getMyr().transform(world.getView().getTransform());

        switch (_mode) {
            case PcbEditorTerrain.MODE_ELEVATE:
                drawAnchors(_cursor, _radius, _spriteElevate);

                break;
        }
    };

    const _options = new EditOptionsTerrain(this);

    /**
     * Get the EditOptionsTerrain object.
     * @returns {EditOptionsTerrain} The EditOptionsTerrain object.
     */
    this.getOptions = () => _options;
}

PcbEditorTerrain.RADIUS_DEFAULT = 2;
PcbEditorTerrain.MODE_ELEVATE = 0;
PcbEditorTerrain.MODE_DEFAULT = PcbEditorTerrain.MODE_ELEVATE;
PcbEditorTerrain.SPRITE_ELEVATE = "terrainElevate";