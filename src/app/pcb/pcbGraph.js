import {getPartState} from "../part/objects";
import {PcbPath} from "./point/pcbPath";
import * as Myr from "../../lib/myr";

/**
 * A graph of all active parts in a PCB which can be traversed to run them.
 * The graph traces the PCB paths and connects parts together.
 * @param {Pcb} pcb A PCB.
 * @constructor
 */
export function PcbGraph(pcb) {
    const Entry = function(fixture) {
        this.fixture = fixture;
        this.pointers = [];
        this.graphs = [];
    };

    const _entries = [];
    let _outPins = 0;

    const analyze = () => {
        for (const fixture of pcb.getFixtures()) {
            let outPins = 0;

            for (const pin of fixture.part.getConfiguration().io) if (pin.type === "out")
                ++outPins;

            _entries.push(new Entry(fixture));
            _outPins += outPins;
        }
    };

    const makeOutputs = () => {
        let outIndex = 1;

        for (const entry of _entries) {
            const pinCount = entry.fixture.part.getConfiguration().io.length;

            for (let i = 0; i < pinCount; ++i) {
                const pin = entry.fixture.part.getConfiguration().io[i];

                if (pin.type === "out") {
                    const path = new PcbPath();

                    path.fromPcb(pcb, new Myr.Vector(
                        entry.fixture.x + pin.x,
                        entry.fixture.y + pin.y));

                    entry.graphs.push(path);
                    entry.pointers.push(outIndex++);
                }
                else {
                    entry.graphs.push(null);
                    entry.pointers.push(0);
                }
            }
        }
    };

    const findOutput = (x, y) => {
        for (const entry of _entries) {
            const pinCount = entry.fixture.part.getConfiguration().io.length;

            for (let pin = 0; pin < pinCount; ++pin) if (entry.graphs[pin] && entry.graphs[pin].isValid())
                if (entry.graphs[pin].containsPosition(x, y))
                    return entry.pointers[pin];
        }

        return 0;
    };

    const connectInputs = () => {
        for (const entry of _entries) {
            const pinCount = entry.fixture.part.getConfiguration().io.length;

            for (let i = 0; i < pinCount; ++i) {
                const pin = entry.fixture.part.getConfiguration().io[i];

                if (pin.type === "in")
                    entry.pointers[i] = findOutput(entry.fixture.x + pin.x, entry.fixture.y + pin.y);
            }
        }
    };

    const build = () => {
        analyze();
        makeOutputs();
        connectInputs();
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

        for (let i =0; i < _entries.length; ++i) {
            states.push(new (getPartState(_entries[i].fixture.part.getDefinition().object))(
                _entries[i].fixture.part.getBehavior(),
                _entries[i].pointers,
                renderer.getPartRenderer(pcb.getFixture(_entries[i].fixture.part))));
        }

        return states;
    };

    build();
}