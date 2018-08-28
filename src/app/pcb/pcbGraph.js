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

    this.getPins = () => fixture.part.getConfiguration().io;
    this.getBehavior = () => fixture.part.getBehavior();

    this.registerPins = (adder, pcb, offset) => {
        let used = 0;

        for (let i = 0; i < this.getPins().length; ++i) {
            const pin = this.getPins()[i];

            if (pin.type === "out") {
                const pinIndex = offset + used++;
                const path = new PcbPath();

                pointers.push(pinIndex);

                path.fromPcb(pcb, new Myr.Vector(fixture.x + pin.x, fixture.y + pin.y));
                adder(new PathEntry(path, pinIndex, this));
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

                if (path)
                    pointers[i] = path.getPinIndex();
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

    this.hasOutputs = () => {
        for (let pin = 0; pin < this.getPins().length; ++pin)
            if (this.getPins()[pin] === "out" && pointers[pin] !== 0)
                return true;

        return false;
    };
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
            pinOffset += part.registerPins(addPath, pcb, pinOffset);
    };

    const connectInputs = parts => {
        for (const part of parts)
            part.connectInputs(_paths);
    };

    const order = parts => {
        const queue = [];

        for (const part of parts) if (!part.hasOutputs())
            queue.push(part);

        for (const enqueued of queue)
            parts.splice(parts.indexOf(enqueued), 1);

        let part;
        while (part = queue.pop()) {
            for (const input of part.getInputs(_paths)) if (!queue.includes(input)) {
                queue.unshift(input);
                parts.splice(parts.indexOf(input), 1);
            }

            _parts.unshift(part);
        }

        for (const part of parts)
            _parts.unshift(part);
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
}