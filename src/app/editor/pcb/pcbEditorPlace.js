import {PartRenderer} from "../../part/partRenderer";
import {Pcb} from "../../pcb/pcb";
import * as Myr from "../../../lib/myr";
import {Part} from "../../part/part";
import {Led} from "../../part/behavior/led";
import {PcbEditorSelect} from "./pcbEditorSelect";

/**
 * A placement editor used to place a part on a pcb.
 * @param {Sprites} sprites A sprites instance.
 * @param {Pcb} pcb The PCB currently being edited.
 * @param {Myr.Vector} cursor The cursor position in cells.
 * @param {Object} editor An interface provided by the Editor to influence the editor.
 * @param {Array} fixtures An array of valid PcbEditorPlace.Fixture instances to place on the PCB.
 * @constructor
 */
export function PcbEditorPlace(sprites, pcb, cursor, editor, fixtures) {
    const COLOR_UNSUITABLE = new Myr.Color(1, 0, 0, 0.5);

    const _renderers = [];
    let _configurationIndex = 0;
    let _suitable = false;

    const makeRenderers = () => {
        for (const fixture of fixtures) {
            if (fixture.isInstance())
                _renderers.push(new PartRenderer(sprites, fixture.part.getConfiguration()));
            else
                _renderers.push(new PartRenderer(sprites, fixture.part.configurations[_configurationIndex]));
        }
    };

    const isSuitable = fixture => {
        let footprint = null;

        if (fixture.isInstance())
            footprint = fixture.part.getConfiguration().footprint;
        else
            footprint = fixture.part.configurations[_configurationIndex].footprint;

        for (const point of footprint.points) {
            const pcbPoint = pcb.getPoint(cursor.x + point.x + fixture.x, cursor.y + point.y + fixture.y);

            if (!pcbPoint || pcbPoint.part !== null)
                return false;
        }

        for (const point of footprint.air)
            if (pcb.getPoint(cursor.x + point.x + fixture.x, cursor.y + point.y + fixture.y))
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
        _suitable = true;

        for (const fixture of fixtures) {
            if (!isSuitable(fixture)) {
                _suitable = false;

                break;
            }
        }
    };

    /**
     * Start dragging action.
     * @returns {Boolean} A boolean indicating whether a drag event has started.
     */
    this.mouseDown = () => {
        if (_suitable) {
            editor.undoPush();

            // TODO: Not every part is a Led!
            for (const fixture of fixtures) {
                let part = null;

                if (fixture.isInstance())
                    part = new Part(fixture.part.getConfiguration(), new Led());
                else
                    part = new Part(fixture.part.configurations[_configurationIndex], new Led());

                pcb.place(
                    part,
                    cursor.x + fixture.x,
                    cursor.y + fixture.y);
            }

            editor.revalidate();
            editor.replace(new PcbEditorSelect(sprites, pcb, cursor, editor));

            return true;
        }
        else
            editor.replace(new PcbEditorSelect(sprites, pcb, cursor, editor));

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

        for (let i = 0; i < fixtures.length; ++i)
            _renderers[i].draw(
                (cursor.x + fixtures[i].x) * Pcb.PIXELS_PER_POINT,
                (cursor.y + fixtures[i].y) * Pcb.PIXELS_PER_POINT);

        if (!_suitable)
            myr.setColor(Myr.Color.WHITE);
    };

    makeRenderers();
}

/**
 * A part to place with an offset.
 * @param {Object} part Either a part definition as defined in parts.json or a Part instance.
 * @param {Number} x The X offset.
 * @param {Number} y The Y offset.
 * @constructor
 */
PcbEditorPlace.Fixture = function(part, x, y) {
    this.part = part;
    this.x = x;
    this.y = y;
};

PcbEditorPlace.Fixture.prototype.isInstance = function() {
    return this.part.configurations === undefined;
};