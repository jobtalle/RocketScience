import {Pcb} from "../pcb/pcb";

export function PcbStorageDrawer() {
    const _pcbs = [];

    this.getPcbs = () => _pcbs;

    this.canAdd = () => {
        return _pcbs.length < PcbStorageDrawer.DRAWER_SIZE;
    };

    this.addPcb = pcb => {
        if (this.canAdd())
            _pcbs.push(pcb);
        else
            console.error("drawer is full");
    };

    this.removePcb = pcb => {
        if (_pcbs.indexOf(pcb) >= 0)
            _pcbs.splice(_pcbs.indexOf(pcb), 1);
        else
            console.error("pcb not in drawer");
    };

    this.removePcbAtIndex = index => {
        if (index < _pcbs.length)
            _pcbs.splice(index, 1);
        else
            console.error("pcb index not in range");
    };

    this.serialize = buffer => {
        buffer.writeInt(_pcbs.length);

        for (const pcb of _pcbs) {
            pcb.serialize(buffer);
        }
    };
}

PcbStorageDrawer.DRAWER_SIZE = 5;

PcbStorageDrawer.deserialize = buffer => {
    const drawer = new PcbStorageDrawer();
    const arrayLength  = buffer.readInt();

    for (let index = 0; index < arrayLength; ++index) {
        drawer.addPcb(Pcb.deserialize(buffer));
    }

    return drawer;
};