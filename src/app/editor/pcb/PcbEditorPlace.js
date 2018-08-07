import {PartRenderer} from "../../parts/renderer/partRenderer";
import {Pcb} from "../../pcb/pcb";
import * as Myr from "../../../lib/myr";

export function PcbEditorPlace(sprites, pcb, cursor, editor, part) {
    const COLOR_UNSUITABLE = new Myr.Color(1, 0, 0, 0.5);

    let _configurationIndex = 0;
    let _renderer = new PartRenderer(sprites, part.CONFIGURATIONS[_configurationIndex]);
    let _suitable = false;

    const isSuitable = () => {
        const footprint = part.CONFIGURATIONS[_configurationIndex].getFootprint();

        for (const point of footprint.getPoints())
            if (!pcb.getPoint(cursor.x + point.x, cursor.y + point.y))
                return false;

        for (const point of footprint.getEmpty())
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

    this.moveCursor = () => {
        _suitable = isSuitable();
    };

    this.startDrag = () => {
        return false;
    };

    this.stopDrag = () => {

    };

    this.cancelAction = () => {

    };

    this.update = timeStep => {

    };

    this.draw = myr => {
        if (!_suitable)
            myr.setColor(COLOR_UNSUITABLE);

        _renderer.draw(cursor.x * Pcb.PIXELS_PER_POINT, cursor.y * Pcb.PIXELS_PER_POINT);

        if (!_suitable)
            myr.setColor(Myr.Color.WHITE);
    };
}