import {EditOptionsTerrain} from "../editoptions/editOptionsTerrain";
import {Terrain} from "../../../terrain/terrain";
import {Scale} from "../../../world/scale";
import * as Myr from "myr.js";
import {StyleUtils} from "../../../utils/styleUtils";

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
    const _spriteAnchor = renderContext.getSprites().getSprite(PcbEditorTerrain.SPRITE_ANCHOR);
    const _mouse = new Myr.Vector(0, 0);
    let _mode = PcbEditorTerrain.MODE_DEFAULT;
    let _cursor = 0;
    let _radius = PcbEditorTerrain.RADIUS_DEFAULT;
    let _deltas = null;
    let _dragY = 0;

    const getMin = (cursor, radius) => Math.max(0, cursor - radius);

    const getMax = (cursor, radius) => Math.min(world.getMission().getTerrain().getHeights().length - 1, cursor + radius);

    const drawAnchors = (cursor, radius, sprite) => {
        const min = getMin(cursor, radius);
        const max = getMax(cursor, radius);

        for (let segment = min; segment <= max; ++segment)
            sprite.draw(
                segment * Terrain.PIXELS_PER_SEGMENT - sprite.getWidth() * 0.5,
                world.getMission().getTerrain().getHeights()[segment] * Scale.PIXELS_PER_METER - sprite.getHeight() * 0.5);
    };

    const drawAnchorsElevated = (cursor, radius, sprite, deltas) => {
        const min = getMin(cursor, radius);
        const max = getMax(cursor, radius);

        for (let segment = min; segment <= max; ++segment)
            sprite.draw(
                segment * Terrain.PIXELS_PER_SEGMENT - sprite.getWidth() * 0.5,
                (world.getMission().getTerrain().getHeights()[segment] + deltas[segment - cursor + radius]) * Scale.PIXELS_PER_METER - sprite.getHeight() * 0.5);
    };

    const apply = (cursor, radius, deltas) => {
        const min = getMin(cursor, radius);
        const max = getMax(cursor, radius);
        const newHeights = Array.from(world.getMission().getTerrain().getHeights());

        for (let segment = min; segment <= max; ++segment) {
            let newHeight = world.getMission().getTerrain().getHeights()[segment] + deltas[segment - cursor + radius];

            if (newHeight > Terrain.MAX_DEPTH)
                newHeight = Terrain.MAX_DEPTH;
            else if (newHeight < -Terrain.MAX_HEIGHT)
                newHeight = -Terrain.MAX_HEIGHT;

            newHeights[segment] = newHeight;
        }

        world.getMission().getTerrain().setHeights(newHeights);
        world.updateTerrain();
    };

    /**
     * Set the edit mode.
     * @param {Number} mode A valid edit mode.
     */
    this.setMode = mode => _mode = mode;

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
        _mouse.x = x;
        _mouse.y = y;

        if (_deltas) {
            const dy = (y - _dragY) / world.getView().getZoom();

            switch (_mode) {
                case PcbEditorTerrain.MODE_ELEVATE:
                    for (let i = 0; i < _deltas.length; ++i) {
                        const factor = _deltas.length > 0 ? (i + 0.5) / _deltas.length : 1;

                        _deltas[i] = (1 - Math.cos(Math.PI * 2 * factor)) * 0.5 * dy * Scale.METERS_PER_PIXEL;
                    }

                    break;
                case PcbEditorTerrain.MODE_SMOOTH:
                    const smoothFactor = 1 - 1 / (1 + Math.abs(dy) * PcbEditorTerrain.SMOOTH_FACTOR);

                    for (let i = PcbEditorTerrain.SMOOTH_RADIUS; i < _deltas.length - PcbEditorTerrain.SMOOTH_RADIUS; ++i) {
                        if (_cursor - _radius + i - PcbEditorTerrain.SMOOTH_RADIUS < 0)
                            continue;

                        if (_cursor - _radius + i + PcbEditorTerrain.SMOOTH_RADIUS >= world.getMission().getTerrain().getHeights().length)
                            break;

                        let aim = 0;

                        for (let j = i - PcbEditorTerrain.SMOOTH_RADIUS; j <= i + PcbEditorTerrain.SMOOTH_RADIUS; ++j)
                            aim += world.getMission().getTerrain().getHeights()[_cursor - _radius + j];

                        aim /= PcbEditorTerrain.SMOOTH_RADIUS * 2 + 1;

                        _deltas[i] = smoothFactor * (aim - world.getMission().getTerrain().getHeights()[_cursor - _radius + i]);
                    }

                    break;
            }
        }
        else {
            _worldPosition.x = x + renderContext.getViewport().getSplitX();
            _worldPosition.y = y;

            world.getView().getInverse().apply(_worldPosition);

            _cursor = Math.round(_worldPosition.x / Terrain.PIXELS_PER_SEGMENT);

            if (_cursor < 0)
                _cursor = 0;
            else if (_cursor >= world.getMission().getTerrain().getHeights().length)
                _cursor = world.getMission().getTerrain().getHeights().length - 1;
        }
    };

    /**
     * Start dragging action.
     * @returns {Boolean} A boolean indicating whether a drag event has started.
     */
    this.mouseDown = () => {
        _deltas = new Array(1 + 2 * _radius).fill(0);
        _dragY = _mouse.y;

        return true;
    };

    /**
     * Finish the current dragging action.
     */
    this.mouseUp = () => {
        if (_deltas)
            apply(_cursor, _radius, _deltas);

        _deltas = null;

        return true;
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

        if (_deltas) {
            drawAnchorsElevated(_cursor, _radius, _spriteElevate, _deltas);
            drawAnchors(_cursor, _radius, _spriteAnchor);
        }
        else
            drawAnchors(_cursor, _radius, _spriteElevate);
    };

    const _options = new EditOptionsTerrain(this);

    /**
     * Get the EditOptionsTerrain object.
     * @returns {EditOptionsTerrain} The EditOptionsTerrain object.
     */
    this.getOptions = () => _options;
}

PcbEditorTerrain.RADIUS_DEFAULT = 3;
PcbEditorTerrain.MODE_ELEVATE = 0;
PcbEditorTerrain.MODE_SMOOTH = 1;
PcbEditorTerrain.MODE_DEFAULT = PcbEditorTerrain.MODE_ELEVATE;
PcbEditorTerrain.SPRITE_ELEVATE = "terrainElevate";
PcbEditorTerrain.SPRITE_ANCHOR = "terrainAnchor";
PcbEditorTerrain.SMOOTH_FACTOR = 0.02;
PcbEditorTerrain.SMOOTH_RADIUS = 2;