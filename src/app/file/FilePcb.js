import {Data} from "./Data";
import {Pcb} from "../pcb/pcb";

/**
 * A file format containing a single PCB.
 * @constructor
 */
export const FilePcb = {
    /**
     * Serialize a PCB.
     * @param {Pcb} pcb A PCB to serialize.
     * @returns {Data} The resulting data.
     */
    serialize: pcb => {
        const data = new Data();

        pcb.serialize(data.getBuffer());

        return data;
    },

    /**
     * Deserialize a PCB.
     * @param {Data} data A data file.
     * @returns {Pcb} A PCB deserialized from the given data file.
     */
    deserialize: data => {
        return Pcb.deserialize(data.getBuffer());
    }
};