import {PcbGraph} from "./pcbGraph";

/**
 * An object containing the state of a PCB being run by a PcbRunner.
 * @param {Pcb} pcb A PCB.
 * @param {PcbRenderer} renderer A pcb renderer to render state to.
 * @param {Object} body A physics body to apply state to.
 * @constructor
 */
export function PcbState(pcb, renderer, body) {
    let _stateArray = null;
    let _states = null;

    const build = () => {
        const graph = new PcbGraph(pcb);

        _stateArray = graph.makeStateArray();
        _states = graph.makeStates(renderer);

        for (const state of _states)
            state.initialize(body);
    };

    /**
     * Update the state.
     */
    this.tick = () => {
        for (const state of _states)
            state.tick(_stateArray);
    };

    build();
}