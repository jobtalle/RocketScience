import {Pcb} from "../pcb/pcb";
import {getString} from "../text/language";
import {StoredPcb} from "./storedPcb";

/**
 * A drawer of PCBs.
 * @constructor
 */
export function PcbStorageDrawer() {
    let _title = getString(PcbStorageDrawer.DRAWER_NAME);
    const _pcbs = [];

    /**
     * Get the PCBs of the drawer
     * @return {[StoredPcb]} An array of StoredPcb objects.
     */
    this.getPcbs = () => _pcbs;

    /**
     * Check if more PCBs can be added.
     * @return {Boolean} True if more can be added, false otherwise.
     */
    this.canAdd = () => {
        return _pcbs.length < PcbStorageDrawer.DRAWER_SIZE;
    };

    /**
     * Add a PCB to the drawer.
     * @param {Pcb} pcb A pcb that has to be added.
     * @param {String} name The name of the PCB.
     */
    this.addPcb = (pcb, name) => {
        if (this.canAdd())
            _pcbs.push(new StoredPcb(pcb, name));
        else
            console.error("drawer is full");
    };

    /**
     * Remove a PCB from the drawer.
     * @param {Pcb} pcb The PCB that should be removed.
     */
    this.removePcb = pcb => {
        if (_pcbs.indexOf(pcb) >= 0)
            _pcbs.splice(_pcbs.indexOf(pcb), 1);
        else
            console.error("pcb not in drawer");
    };

    /**
     * Remove a PCB at a specified index from the drawer.
     * @param {Number} index The index of the PCB.
     */
    this.removePcbAtIndex = index => {
        if (index < _pcbs.length)
            _pcbs.splice(index, 1);
        else
            console.error("pcb index not in range");
    };

    /**
     * Get the title of the drawer.
     * @return {string}
     */
    this.getTitle = () => _title;

    /**
     * Set the title of the drawer.
     * @param {String} title The title.
     */
    this.setTitle = (title) => {
        _title = title;
    };

    /**
     * Serialize the object to a byte buffer.
     * @param {ByteBuffer} buffer A byte buffer to serialize from.
     */
    this.serialize = buffer => {
        buffer.writeString(_title);
        buffer.writeInt(_pcbs.length);

        for (const pcb of _pcbs) {
            pcb.serialize(buffer);
        }
    };
}

PcbStorageDrawer.DRAWER_SIZE = 5;

/**
 * Deserialize the object.
 * @param {ByteBuffer} buffer A byte buffer to serialize from.
 * @return {PcbStorageDrawer}
 */
PcbStorageDrawer.deserialize = buffer => {
    const drawer = new PcbStorageDrawer();

    drawer.setTitle(buffer.readString());

    const arrayLength  = buffer.readInt();

    for (let index = 0; index < arrayLength; ++index) {
        const storedPcb = StoredPcb.deserialize(buffer);
        drawer.addPcb(storedPcb.pcb, storedPcb.name);
    }

    return drawer;
};

PcbStorageDrawer.DRAWER_NAME = "DRAWER_NAME";