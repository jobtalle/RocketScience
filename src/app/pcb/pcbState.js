import {PcbGraph} from "./pcbGraph";

/**
 * An object containing the state of a PCB being run by a PcbRunner.
 * @param {Pcb} pcb A PCB.
 * @param {PcbRenderer} renderer A pcb renderer to render state to.
 * @param {Object} body A physics body to apply state to.
 * @param {ControllerState} controllerState A controller state to read input from.
 * @constructor
 */
export function PcbState(pcb, renderer, body, controllerState) {
    let _stateArray = null;
    let _states = null;

    const build = () => {
        const graph = new PcbGraph(pcb);

        _stateArray = graph.makeStateArray();
        _states = graph.makeStates(renderer);

        for (const state of _states)
            state.initialize(body, controllerState);
    };

    /**
     * Update the state.
     */
    this.tick = () => {
        for (const state of _states)
            state.tick(_stateArray);
    };

    /**
     * Update the parts.
     * @param {Number} timeStep The time step.
     */
    this.update = timeStep => {
        for (const state of _states) if (state.update)
            state.update(timeStep);
    };

    /**
     * Get this states array.
     * @returns {Array} An array containing all output pin states.
     */
    this.getArray = () => _stateArray;

    build();
}