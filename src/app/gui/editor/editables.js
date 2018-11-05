import {PcbRenderer} from "../../pcb/pcbRenderer";
import {Scale} from "../../world/scale";

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
            _renderers.push(new PcbRenderer(renderContext, editable.getPcb(), PcbRenderer.LEVEL_PARTS));
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
            _renderers[world.getMission().getEditables().indexOf(_current)].revalidate();

        _current = current;
    };

    makeRenderers();
}