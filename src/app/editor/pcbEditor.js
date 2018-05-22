import {Pcb} from "../pcb/pcb";
import {PcbRenderer} from "../pcb/pcbRenderer";

/**
 * The interactive Pcb editor which takes care of sizing & modifying a Pcb.
 * @param {Object} myr An instance of the Myriad engine.
 * @param {Object} sprites All sprites.
 * @param {Number} width The editor width.
 * @param {Number} height The editor height.
 * @constructor
 */
export function PcbEditor(myr, sprites, width, height) {
    const SCALE = 3;

    const _surface = new myr.Surface(
        Math.ceil(width / SCALE),
        Math.ceil(height / SCALE));

    let _pcb = null;
    let _renderer = null;

    /**
     * Start editing a pcb.
     * @param {Object} pcb A pcb instance to edit.
     */
    this.edit = pcb => {
        _pcb = pcb;
        _renderer = new PcbRenderer(myr, sprites, pcb);
    };

    /**
     * Update the state of the pcb editor.
     * @param timeStep The number of seconds passed after the previous update.
     */
    this.update = timeStep => {
        _surface.bind();
        _surface.clear();

        myr.push();
        myr.translate(
            Math.floor((_surface.getWidth() - _pcb.getWidth() * Pcb.POINT_SIZE) * 0.5),
            Math.floor((_surface.getHeight() - _pcb.getHeight() * Pcb.POINT_SIZE) * 0.5));

        _renderer.draw(0, 0);

        myr.pop();
    };

    /**
     * Draw the pcb editor.
     */
    this.draw = x => {
        _surface.drawScaled(x, 0, SCALE, SCALE);
    };

    /**
     * Get the pcb editor width
     * @returns {Number} The width of the editor in pixels.
     */
    this.getWidth = () => width;
}