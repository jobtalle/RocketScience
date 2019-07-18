import {PcbStorageDrawer} from "./pcbStorageDrawer";

/**
 * The storage class for the PCBs. Contains drawers, which hold the PCBs.
 * @constructor
 */
export function PcbStorage() {
    const _drawers = [];

    /**
     * Check if more drawers can be added.
     * @return {Boolean} True if more can be added, false otherwise.
     */
    this.canAdd = () => {
        return _drawers.length < PcbStorage.MAX_DRAWERS;
    };

    /**
     * Get all the drawers.
     * @return {Array} An array of PcbStorageDrawers.
     */
    this.getDrawers = () => _drawers;

    /**
     * Add a drawer to the storage.
     * @param {PcbStorageDrawer} drawer A new PcbStorageDrawer.
     */
    this.addDrawer = drawer => {
        if (this.canAdd())
            _drawers.push(drawer);
        else
            console.error("no room for more drawers!")
    };

    /**
     * Remove a drawer from storage.
     * @param {PcbStorageDrawer} drawer The drawer that should be removed.
     */
    this.removeDrawer = drawer => {
        if (_drawers.indexOf(drawer))
            _drawers.splice(_drawers.indexOf(drawer));
        else
            console.error("could not remove drawer");
    };

    /**
     * Serialize the object.
     * @param {ByteBuffer} buffer A byte buffer to serialize from.
     */
    this.serialize = (buffer) => {
        buffer.writeInt(_drawers.length);

        for (const drawer of _drawers) {
            drawer.serialize(buffer);
        }
    };
}

PcbStorage.MAX_DRAWERS = 5;

/**
 * Deserialize the object.
 * @param {ByteBuffer} buffer A byte buffer to serialize from.
 * @return {PcbStorage}
 */
PcbStorage.deserialize = (buffer) => {
    const arrayLength = buffer.readInt();
    const storage = new PcbStorage();

    for (let index = 0; index < arrayLength; ++index) {
        storage.addDrawer(PcbStorageDrawer.deserialize(buffer));
    }

    return storage;
};