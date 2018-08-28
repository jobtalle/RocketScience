import {getPartState} from "../part/objects";
import {PcbPath} from "./point/pcbPath";
import * as Myr from "../../lib/myr";

const findOutput = (paths, x, y) => {
    for (const path of paths)
        if (path.contains(x, y))
            return path.getPinIndex();

    return 0;
};

const PathEntry = function(path, pinIndex) {
    this.contains = (x, y) => path.containsPosition(x, y);
    this.getPinIndex = () => pinIndex;
};

const PartEntry = function(fixture) {
    const pointers = [];

    this.getPins = () => fixture.part.getConfiguration().io;
    this.getBehavior = () => fixture.part.getBehavior();

    this.registerPins = (paths, pcb, offset) => {
        let used = 0;

        for (let i = 0; i < this.getPins().length; ++i) {
            const pin = this.getPins()[i];

            if (pin.type === "out") {
                const pinIndex = offset + used++;
                const path = new PcbPath();

                pointers.push(pinIndex);

                path.fromPcb(pcb, new Myr.Vector(fixture.x + pin.x, fixture.y + pin.y));
                paths.push(new PathEntry(path, pinIndex));
            }
            else
                pointers.push(0);
        }

        return used;
    };

    this.connectInputs = paths => {
        for (let i = 0; i < this.getPins().length; ++i) {
            const pin = this.getPins()[i];

            if (pin.type === "in")
                pointers[i] = findOutput(paths, fixture.x + pin.x, fixture.y + pin.y);
        }
    };

    this.makeState = (pcb, renderer) => new (getPartState(fixture.part.getDefinition().object))(
        this.getBehavior(),
        pointers,
        renderer.getPartRenderer(fixture));
};

/**
 * A graph of all active parts in a PCB which can be traversed to run them.
 * The graph traces the PCB paths and connects parts together.
 * @param {Pcb} pcb A PCB.
 * @constructor
 */
export function PcbGraph(pcb) {
    const _paths = [];
    const _parts = [];
    let _outPins = 0;

    const analyze = () => {
        for (const fixture of pcb.getFixtures()) {
            const entry = new PartEntry(fixture);
            let outPins = 0;

            for (const pin of entry.getPins()) if (pin.type === "out")
                ++outPins;

            _parts.push(entry);
            _outPins += outPins;
        }
    };

    const makeOutputs = () => {
        let pinOffset = 1;

        for (const part of _parts)
            pinOffset += part.registerPins(_paths, pcb, pinOffset);
    };

    const connectInputs = () => {
        for (const part of _parts)
            part.connectInputs(_paths);
    };

    const order = () => {

    };

    const build = () => {
        analyze();
        makeOutputs();
        connectInputs();
        order();
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

        for (const entry of _parts)
            states.push(entry.makeState(pcb, renderer));

        return states;
    };

    build();
}