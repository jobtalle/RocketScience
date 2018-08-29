import {getPartState} from "../part/objects";
import {PcbPath} from "./point/pcbPath";
import * as Myr from "../../lib/myr";

const findOutput = (paths, x, y) => {
    for (const path of paths) if (path.contains(x, y))
        return path;

    return null;
};

const PathEntry = function(path, pinIndex, part) {
    this.getPath = () => path;
    this.contains = (x, y) => path.containsPosition(x, y);
    this.getPinIndex = () => pinIndex;
    this.getPartEntry = () => part;
};

const PartEntry = function(fixture) {
    const pointers = [];
    let hasOutputs = false;
    let requiredOutputs = 0;

    this.getPins = () => fixture.part.getConfiguration().io;
    this.getBehavior = () => fixture.part.getBehavior();
    this.addRequiredOutput = () => ++requiredOutputs;
    this.hasOutputs = () => hasOutputs;
    this.connectOutput = () => --requiredOutputs === 0;
    this.getRequiredOutputs = () => requiredOutputs;
    this.getName = () => fixture.part.getDefinition().object;

    this.registerPins = (pcb, pathAdder, pinOffset) => {
        let used = 0;

        for (let i = 0; i < this.getPins().length; ++i) {
            const pin = this.getPins()[i];

            if (pin.type === "out") {
                const pinIndex = pinOffset + used++;
                const path = new PcbPath();

                pointers.push(pinIndex);
                hasOutputs = true;

                path.fromPcb(pcb, new Myr.Vector(fixture.x + pin.x, fixture.y + pin.y));
                pathAdder(new PathEntry(path, pinIndex, this));
            }
            else
                pointers.push(0);
        }

        return used;
    };

    this.connectInputs = paths => {
        for (let i = 0; i < this.getPins().length; ++i) {
            const pin = this.getPins()[i];

            if (pin.type === "in") {
                const path = findOutput(paths, fixture.x + pin.x, fixture.y + pin.y);

                if (path) {
                    path.getPartEntry().addRequiredOutput();
                    pointers[i] = path.getPinIndex();
                }
            }
        }
    };

    this.getInputs = paths => {
        const inputs = [];

        for (const pin of this.getPins()) if (pin.type === "in") {
            const path = findOutput(paths, fixture.x + pin.x, fixture.y + pin.y);

            if (path)
                inputs.push(path.getPartEntry());
        }

        return inputs;
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
    const _invalidPaths = [];
    let _outPins = 0;

    const addPath = entry => {
        for (const path of _paths) if (path.getPath().intersects(entry.getPath())) {
            _invalidPaths.push(entry.getPath());

            return;
        }

        _paths.push(entry);
    };

    const analyze = parts => {
        for (const fixture of pcb.getFixtures()) {
            const entry = new PartEntry(fixture);
            let outPins = 0;

            for (const pin of entry.getPins()) if (pin.type === "out")
                ++outPins;

            parts.push(entry);
            _outPins += outPins;
        }
    };

    const makeOutputs = parts => {
        let pinOffset = 1;

        for (const part of parts)
            pinOffset += part.registerPins(pcb, addPath, pinOffset);
    };

    const connectInputs = parts => {
        for (const part of parts)
            part.connectInputs(_paths);
    };

    const orderIsolated = parts => {
        for (const part of parts)
            _parts.push(part);
    };

    const orderUnsatisfied = (parts, unsatisfied) => {
        let newRoot = unsatisfied[0];

        for (let i = 1; i < unsatisfied.length; ++i) {
            const entry = unsatisfied[i];

            if (entry.getRequiredOutputs() > newRoot.getRequiredOutputs())
                newRoot = entry;
        }

        parts.splice(parts.indexOf(newRoot), 1);

        order(parts, [newRoot]);
    };

    const order = (parts, queue) => {
        const unsatisfied = [];

        if (!queue)
            queue = [];

        for (let i = parts.length; i-- > 0;) if (!parts[i].hasOutputs()) {
            queue.push(parts[i]);
            parts.splice(i, 1);
        }

        let part;
        while (part = queue.pop()) {
            for (const input of part.getInputs(_paths)) if (parts.includes(input)) {
                if (!input.connectOutput()) {
                    if (!unsatisfied.includes(input))
                        unsatisfied.push(input);

                    continue;
                }

                if (unsatisfied.includes(input))
                    unsatisfied.splice(unsatisfied.indexOf(input), 1);

                queue.unshift(input);
                parts.splice(parts.indexOf(input), 1);
            }

            _parts.unshift(part);
        }

        if (unsatisfied.length > 0)
            orderUnsatisfied(parts, unsatisfied);
        else
            orderIsolated(parts);
    };

    const build = () => {
        const parts = [];

        analyze(parts);
        makeOutputs(parts);
        connectInputs(parts);

        order(parts);
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

    /**
     * Get the invalid paths on this graph.
     * An invalid path has multiple outputs connected to it.
     * @returns {Array} An array of PcbPaths connected to multiple outputs.
     */
    this.getInvalidPaths = () => _invalidPaths;

    build();

    // Debug print:
    let log = "";

    for (const part of _parts)
        log += part.getName() + ", ";

    console.log("Parts: " + log);
}