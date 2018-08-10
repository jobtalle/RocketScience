import {PartRenderer} from "../../part/partRenderer";
import {Pcb} from "../../pcb/pcb";
import * as Myr from "../../../lib/myr";
import {Part} from "../../part/part";
import {Led} from "../../part/behavior/led";

/**
 * A placement editor used to place a new part on a pcb.
 * @param {Sprites} sprites A sprites instance.
 * @param {Pcb} pcb The PCB currently being edited.
 * @param {Myr.Vector} cursor The cursor position in cells.
 * @param {Object} editor An interface provided by the Editor to influence the editor.
 * @param {Object} part A valid part from part.json to place on the PCB.
 * @constructor
 */
export function PcbEditorPlace(sprites, pcb, cursor, editor, part) {
    const COLOR_UNSUITABLE = new Myr.Color(1, 0, 0, 0.5);

    let _configurationIndex = 0;
    let _renderer = new PartRenderer(sprites, part.configurations[_configurationIndex]);
    let _suitable = false;

    const isSuitable = () => {
        const footprint = part.configurations[_configurationIndex].footprint;

        for (const point of footprint.points) {
            const pcbPoint = pcb.getPoint(cursor.x + point.x, cursor.y + point.y);

            if (!pcbPoint || pcbPoint.part !== null)
                return false;
        }

        for (const point of footprint.air)
            if (pcb.getPoint(cursor.x + point.x, cursor.y + point.y))
                return false;

        return true;
    };

    /**
     * A key is pressed.
     * @param {String} key A key.
     * @param {Boolean} control Indicates whether the control button is pressed.
     */
    this.onKeyDown = (key, control) => {

    };

    /**
     * Tell the editor the cursor has moved.
     */
    this.moveCursor = () => {
        _suitable = isSuitable();
    };

    /**
     * Start dragging action.
     * @returns {Boolean} A boolean indicating whether a drag event has started.
     */
    this.mouseDown = () => {
        if (_suitable) {
            editor.undoPush();

            // TODO: Not every part is a Led!
            pcb.place(new Part(part.configurations[_configurationIndex], new Led()), cursor.x, cursor.y);

            editor.revalidate();

            return true;
        }

        return false;
    };

    /**
     * Finish the current dragging action.
     */
    this.mouseUp = () => {

    };

    /**
     * Cancel any actions deviating from this editors base state.
     */
    this.cancelAction = () => {

    };

    /**
     * Update this editor.
     * @param {Number} timeStep The time passed since the last update in seconds.
     */
    this.update = timeStep => {

    };

    /**
     * Draw this editor.
     * @param {Myr} myr A myriad instance.
     */
    this.draw = myr => {
        if (!_suitable)
            myr.setColor(COLOR_UNSUITABLE);

        _renderer.draw(cursor.x * Pcb.PIXELS_PER_POINT, cursor.y * Pcb.PIXELS_PER_POINT);

        if (!_suitable)
            myr.setColor(Myr.Color.WHITE);
    };
}