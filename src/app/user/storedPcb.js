import {Pcb} from "../pcb/pcb";

/**
 * A stored PCB.
 * @param {Pcb} pcb A PCB.
 * @param {String} name The name of the pcb.
 * @constructor
 */
export function StoredPcb(pcb, name) {
    this.pcb = pcb;
    this.name = name;

    /**
     * Serialize the object.
     * @param {ByteBuffer} buffer A ByteBuffer.
     */
    this.serialize = (buffer) => {
        buffer.writeString(name);
        pcb.serialize(buffer);
    };
}

/**
 * Deserialize the object.
 * @param {ByteBuffer} buffer A ByteBuffer.
 * @return {StoredPcb} The deserialized StoredPcb.
 */
StoredPcb.deserialize = (buffer) => {
    const name = buffer.readString();
    const pcb = Pcb.deserialize(buffer);

    return new StoredPcb(pcb, name);
};