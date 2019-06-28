import {PcbStorageDrawer} from "./pcbStorageDrawer";

export function PcbStorage() {
    const _drawers = [];

    this.canAdd = () => {
        return _drawers.length < PcbStorage.MAX_DRAWERS;
    };

    this.addDrawer = drawer => {
        if (this.canAdd())
            _drawers.push(drawer);
        else
            console.error("no room for more drawers!")
    };

    this.removeDrawer = drawer => {
        if (_drawers.indexOf(drawer))
            _drawers.splice(_drawers.indexOf(drawer));
        else
            console.error("could not remove drawer");
    };

    this.serialize = (buffer) => {
        buffer.writeInt(_drawers.length);

        for (const drawer of _drawers) {
            drawer.serialize(buffer);
        }
    };
}

PcbStorage.MAX_DRAWERS = 5;

PcbStorage.deserialize = (buffer) => {
    const arrayLength = buffer.readInt();
    const storage = new PcbStorage();

    for (let index = 0; index < arrayLength; ++index) {
        storage.addDrawer(PcbStorageDrawer.deserialize(buffer));
    }

    return storage;
};