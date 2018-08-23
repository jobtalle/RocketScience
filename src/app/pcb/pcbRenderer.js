import {Pcb} from "./pcb";
import {PartRenderer} from "../part/partRenderer";
import * as Myr from "../../lib/myr";

/**
 * A PCB renderer.
 * @param {Myr} myr A Myriad instance.
 * @param {Sprites} sprites The sprites library.
 * @param {Pcb} pcb A pcb.
 * @constructor
 */
export function PcbRenderer(myr, sprites, pcb) {
    const SPRITE_POINT = sprites.getSprite("pcbPoint");

    const _partRenderers = [];
    const _partPositions = [];
    let _initialized = false;
    let _layerPcb = null;

    const updateSurfaces = () => {
        _initialized = true;

        _layerPcb = new myr.Surface(
            Pcb.PIXELS_PER_POINT * pcb.getWidth(),
            Pcb.PIXELS_PER_POINT * pcb.getHeight());
        _layerPcb.bind();
        _layerPcb.clear();

        for(let row = 0; row < pcb.getHeight(); ++row) for(let column = 0; column < pcb.getWidth(); ++column) {
            const point = pcb.getPoint(column, row);

            if (point) {
                SPRITE_POINT.draw(
                    column * Pcb.PIXELS_PER_POINT,
                    row * Pcb.PIXELS_PER_POINT);


            }
        }
    };

    const updatePartRenderers = () => {
        _partRenderers.splice(0, _partRenderers.length);
        _partPositions.splice(0, _partPositions.length);

        for (const fixture of pcb.getFixtures()) {
            const position = new Myr.Vector(fixture.x * Pcb.PIXELS_PER_POINT, fixture.y * Pcb.PIXELS_PER_POINT);
            let insertAt = 0;

            while (insertAt < _partPositions.length && _partPositions[insertAt].y < position.y)
                ++insertAt;

            _partRenderers.splice(insertAt, 0, new PartRenderer(sprites, fixture.part.getConfiguration()));
            _partPositions.splice(insertAt, 0, position);
        }
    };

    const getFixtureIndex = fixture => {
        for (let i = 0; i < _partPositions.length; ++i) {
            if (_partPositions[i].x === fixture.x * Pcb.PIXELS_PER_POINT &&
                _partPositions[i].y === fixture.y * Pcb.PIXELS_PER_POINT)
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
     * Draws the associated pcb.
     * @param {Number} x The x coordinate in pixels.
     * @param {Number} y The y coordinate in pixels.
     */
    this.draw = (x, y) => {
        _layerPcb.draw(x, y);

        for (let i = 0; i < _partRenderers.length; ++i)
            _partRenderers[i].draw(_partPositions[i].x, _partPositions[i].y);
    };

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