import {getPartState} from "../part/objects";

/**
 * A graph of all active parts in a PCB which can be traversed to run them.
 * The graph traces the PCB paths and connects parts together.
 * @param {Pcb} pcb A PCB.
 * @constructor
 */
export function PcbGraph(pcb) {
    const _emitters = [];
    let _outPins = 0;

    const build = () => {
        for (const fixture of pcb.getFixtures()) {
            let outPins = 0;
            let inPins = 0;

            for (const pin of fixture.part.getConfiguration().io) {
                if (pin.type === "out")
                    ++outPins;
                else
                    ++inPins;
            }

            if (outPins > 0) {
                _emitters.push(fixture.part);

                _outPins += outPins;
            }
        }
    };

    /**
     * Get all emitter parts.
     * @returns {Array} all emitter parts.
     */
    this.getEmitters = () => _emitters;

    /**
     * Make a state graph to be used by a PcbGraph.
     * @returns {Array} a state array.
     */
    this.makeStateArray = () => new Array(_outPins + 1).fill(0);

    /**
     * Make an array of connected part states to update.
     * @returns {Array} an array of part states.
     */
    this.makeStates = () => {
        const states = [];

        for (const emitter of _emitters)
            states.push(new (getPartState(emitter.getDefinition().object))(emitter));

        return states;
    };

    build();
}