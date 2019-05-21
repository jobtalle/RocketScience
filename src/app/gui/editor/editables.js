import {PcbRenderer} from "../../pcb/pcbRenderer";
import {Scale} from "../../world/scale";
import Myr from "myr.js"

/**
 * The editables in the world that may be edited.
 * @param {RenderContext} renderContext A render context.
 * @param {World} world A world instance to interact with.
 * @constructor
 */
export function Editables(renderContext, world) {
    const _renderers = [];

    let _current = null;

    const makeRenderers = () => {
        for (const editable of world.getMission().getEditables())
            _renderers.push(new PcbRenderer(renderContext, editable.getPcb(), PcbRenderer.LEVEL_HULL));
    };

    /**
     * Draw all editables except for the one currently being edited.
     */
    this.draw = () => {
        for (let i = 0; i < world.getMission().getEditables().length; ++i) {
            const editable = world.getMission().getEditables()[i];

            if (editable === _current)
                continue;

            _renderers[i].drawBody(
                (editable.getRegion().getOrigin().x + editable.getOffset().x) * Scale.PIXELS_PER_METER,
                (editable.getRegion().getOrigin().y + editable.getOffset().y) * Scale.PIXELS_PER_METER);
        }
    };

    /**
     * Set the currently being edited editable.
     * @param {Editable} current The currently being edited editable, or null if none is being edited.
     */
    this.setCurrent = current => {
        if (_current)
            _renderers[world.getMission().getEditables().indexOf(_current)] = new PcbRenderer(
                renderContext,
                _current.getPcb(),
                PcbRenderer.LEVEL_HULL);

        _current = current;
    };

    /**
     * Get the editable at a certain world position.
     * @param {Number} x The x position in the world in meters.
     * @param {Number} y The y position in the world in meters.
     * @returns {Editable} The editable found at that position, or null if no editable is under it.
     */
    this.getEditableAt = (x, y) => {
        const at = new Myr.Vector(x, y);

        world.getView().getInverse().apply(at);

        for (const editable of world.getMission().getEditables()) {
            if (
                at.x * Scale.METERS_PER_PIXEL >= editable.getRegion().getOrigin().x &&
                at.y * Scale.METERS_PER_PIXEL >= editable.getRegion().getOrigin().y &&
                at.x * Scale.METERS_PER_PIXEL <= editable.getRegion().getOrigin().x + editable.getRegion().getSize().x &&
                at.y * Scale.METERS_PER_PIXEL <= editable.getRegion().getOrigin().y + editable.getRegion().getSize().y)
                return editable;
        }

        return null;
    };

    /**
     * Free all resources maintained by this editables.
     */
    this.free = () => {
        for (const renderer of _renderers)
            renderer.free();
    };

    makeRenderers();
}