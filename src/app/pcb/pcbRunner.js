import {PcbState} from "./pcbState";
import {PcbGraph} from "./pcbGraph";

/**
 * A PCB runner executing its parts behavior over time.
 * @param {Pcb} pcb A PCB.
 * @constructor
 */
export function PcbRunner(pcb) {
    const _graph = new PcbGraph(pcb);
    const _state = new PcbState();

    /**
     * Update the PCB for one cycle.
     */
    this.tick = () => {

    };
}