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

    const analyze = () => {
        for (const fixture of pcb.getFixtures()) {
            let outPins = 0;
            let inPins = 0;

            for (const pin of fixture.part.getConfiguration().io) {
                if (pin.type === "out")
                    ++outPins;
                else
                    ++inPins;
            }

            if (outPins > 0 || inPins > 0) {
                _emitters.push(fixture.part);

                _outPins += outPins;
            }
        }
    };

    const connect = () => {

    };

    const build = () => {
        analyze();
        connect();
    };

    /**
     * Make a state graph to be used by a PcbGraph.
     * @returns {Array} a state array.
     */
    this.makeStateArray = () => new Array(_outPins + 1).fill(0);

    /**
     * Make an array of connected part states to update.
     * @param {PcbRenderer} renderer A PCB renderer to assign to the states.
     * @returns {Array} an array of part states.
     */
    this.makeStates = renderer => {
        const states = [];

        for (const emitter of _emitters) {
            states.push(new (getPartState(emitter.getDefinition().object))(
                emitter,
                [],
                renderer.getPartRenderer(pcb.getFixture(emitter))));
        }

        return states;
    };

    build();
}