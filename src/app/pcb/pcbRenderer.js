import {Pcb} from "./pcb";
import {PartRenderer} from "../part/partRenderer";
import {PcbPointRenderer} from "./point/pcbPointRenderer";
import {Scale} from "../world/scale";
import Myr from "myr.js"

/**
 * A PCB renderer.
 * @param {RenderContext} renderContext A render context.
 * @param {Pcb} pcb A pcb.
 * @param {Object} level A valid render level constant.
 * @constructor
 */
export function PcbRenderer(renderContext, pcb, level) {
    const SPRITE_POINT = renderContext.getSprites().getSprite("pcbPoint");
    const SPRITE_POINT_LOCKED = renderContext.getSprites().getSprite("pcbPointLocked");

    const _pointRenderer = new PcbPointRenderer(renderContext, false);
    const _partRenderers = [];
    const _partPositions = [];
    let _initialized = false;
    let _layerPcb = null;
    let _level = level;

    const updateSurfaces = () => {
        _initialized = true;

        _layerPcb = new (renderContext.getMyr().Surface)(
            Scale.PIXELS_PER_POINT * pcb.getWidth(),
            Scale.PIXELS_PER_POINT * pcb.getHeight());
        _layerPcb.bind();
        _layerPcb.clear();

        // Render board
        for(let row = 0; row < pcb.getHeight(); ++row) for(let column = 0; column < pcb.getWidth(); ++column) {
            const point = pcb.getPoint(column, row);

            if (point) {
                if (point.isLocked())
                    SPRITE_POINT_LOCKED.draw(
                        column * Scale.PIXELS_PER_POINT,
                        row * Scale.PIXELS_PER_POINT);
                else
                    SPRITE_POINT.draw(
                        column * Scale.PIXELS_PER_POINT,
                        row * Scale.PIXELS_PER_POINT);
            }
        }

        // Render etchings
        for(let row = 0; row < pcb.getHeight(); ++row) for(let column = 0; column < pcb.getWidth(); ++column) {
            const point = pcb.getPoint(column, row);

            if (!point)
                continue;

            _pointRenderer.render(point, column * Scale.PIXELS_PER_POINT, row * Scale.PIXELS_PER_POINT);
        }
    };

    const updatePartRenderers = () => {
        _partRenderers.splice(0, _partRenderers.length);
        _partPositions.splice(0, _partPositions.length);

        for (const fixture of pcb.getFixtures()) {
            const position = new Myr.Vector(fixture.x * Scale.PIXELS_PER_POINT, fixture.y * Scale.PIXELS_PER_POINT);
            let insertAt = 0;

            while (insertAt < _partPositions.length && _partPositions[insertAt].y < position.y)
                ++insertAt;

            _partRenderers.splice(insertAt, 0, new PartRenderer(renderContext, fixture.part.getConfiguration()));
            _partPositions.splice(insertAt, 0, position);
        }
    };

    const getFixtureIndex = fixture => {
        for (let i = 0; i < _partPositions.length; ++i) {
            if (_partPositions[i].x === fixture.x * Scale.PIXELS_PER_POINT &&
                _partPositions[i].y === fixture.y * Scale.PIXELS_PER_POINT)
                return i;
        }

        return -1;
    };

    /**
     * Get the part renderer of a specific part.
     * @param {Fixture} fixture A valid fixture to get the renderer of.
     */
    this.getPartRenderer = fixture => _partRenderers[getFixtureIndex(fixture)];

    /**
     * Draws the associated pcb body.
     * @param {Number} x The x coordinate in pixels.
     * @param {Number} y The y coordinate in pixels.
     */
    this.drawBody = (x, y) => {
        switch (_level) {
            case PcbRenderer.LEVEL_BOARD:
                _layerPcb.draw(x, y);
                break;
            case PcbRenderer.LEVEL_PARTS:
                _layerPcb.draw(x, y);

                for (let i = 0; i < _partRenderers.length; ++i) {
                    _partRenderers[i].drawInternal(_partPositions[i].x, _partPositions[i].y);
                    _partRenderers[i].drawExternal(_partPositions[i].x, _partPositions[i].y);
                }

                break;
            case PcbRenderer.LEVEL_HULL:
                _layerPcb.draw(x, y);

                for (let i = 0; i < _partRenderers.length; ++i) {
                    _partRenderers[i].drawInternal(_partPositions[i].x, _partPositions[i].y);
                    _partRenderers[i].drawExternal(_partPositions[i].x, _partPositions[i].y);
                }

                break;
        }
    };

    /**
     * Draws the separate parts that are not part of the PCB body.
     */
    this.drawSeparate = () => {
        switch (_level) {
            case PcbRenderer.LEVEL_HULL:
                for (let i = 0; i < _partRenderers.length; ++i)
                    _partRenderers[i].drawSeparate();

                break;
        }
    };

    /**
     * Sets the level to render the PCB at.
     * @param {Object} level The level of this pcb to render, which must be a valid constant of this object.
     */
    this.setLevel = level => {
        _level = level;
    };

    /**
     * Get the current render level.
     * @returns {Object} A render level constant.
     */
    this.getLevel = () => _level;

    /**
     * Update the pcb representation.
     */
    this.revalidate = () => {
        updateSurfaces();
        updatePartRenderers();
    };

    /**
     * Free all resources occupied by this pcb renderer.
     */
    this.free = () => {
        if (!_initialized)
            return;

        _initialized = false;

        _layerPcb.free();
        _layerPcb = null;
    };

    this.revalidate();
}

PcbRenderer.LEVEL_BOARD = 0;
PcbRenderer.LEVEL_PARTS = 1;
PcbRenderer.LEVEL_HULL = 2;