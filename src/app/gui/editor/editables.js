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

    const makeRenderers = () => {
        for (const editable of world.getMission().getEditables())
            _renderers.push(new PcbRenderer(renderContext, editable.getPcb(), PcbRenderer.LEVEL_PARTS));
    };

    this.draw = () => {
        for (let i = 0; i < world.getMission().getEditables().length; ++i) {
            const editable = world.getMission().getEditables()[i];

            _renderers[i].drawBody(
                (editable.getRegion().getOrigin().x + editable.getOffset().x) * Scale.PIXELS_PER_METER,
                (editable.getRegion().getOrigin().y + editable.getOffset().y) * Scale.PIXELS_PER_METER);
        }
    };

    makeRenderers();
}