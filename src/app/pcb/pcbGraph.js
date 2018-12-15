import {getPartObject} from "../part/objects";
import {PcbPath} from "./point/pcbPath";
import {Pin} from "../part/pin";
import Myr from "myr.js"

const findOutput = (paths, x, y) => {
    for (const path of paths) if (path.contains(x, y))
        return path;

    return null;
};

const PathEntry = function(path, pinIndex, part) {
    this.contains = (x, y) => path.containsPosition(x, y);
    this.getPinIndex = () => pinIndex;
    this.getPartEntry = () => part;
};

const PartEntry = function(fixture) {
    const _pointers = [];

    let _hasOutputs = false;
    let _requiredOutputs = 0;

    this.getPins = () => fixture.part.getConfiguration().io;
    this.addRequiredOutput = () => ++_requiredOutputs;
    this.hasOutputs = () => _hasOutputs;
    this.connectOutput = () => --_requiredOutputs === 0;
    this.getRequiredOutputs = () => _requiredOutputs;
    this.getPointers = () => _pointers;
    this.getFixture = () => fixture;

    this.registerPins = (pcb, pathAdder, pinOffset) => {
        let used = 0;

        for (const pin of this.getPins()) {
            if (pin.type === Pin.TYPE_OUT) {
                const pinIndex = pinOffset + used++;
                const path = new PcbPath();

                _pointers.push(pinIndex);
                _hasOutputs = true;

                path.fromPcb(pcb, new Myr.Vector(fixture.x + pin.x, fixture.y + pin.y));
                pathAdder(new PathEntry(path, pinIndex, this));
            }
            else if (pin.type === Pin.TYPE_IN)
                _pointers.push(0);
        }

        return used;
    };

    this.connectInputs = paths => {
        for (const pin of this.getPins()) {
            if (pin.type === Pin.TYPE_IN) {
                const path = findOutput(paths, fixture.x + pin.x, fixture.y + pin.y);

                if (path) {
                    path.getPartEntry().addRequiredOutput();
                    _pointers[this.getPins().indexOf(pin)] = path.getPinIndex();
                }
            }
        }
    };

    this.getInputs = paths => {
        const inputs = [];

        for (const pin of this.getPins()) if (pin.type === Pin.TYPE_IN) {
            const path = findOutput(paths, fixture.x + pin.x, fixture.y + pin.y);

            if (path)
                inputs.push(path.getPartEntry());
        }

        return inputs;
    };

    this.makeState = (pcb, renderer) => new (getPartObject(fixture.part.getDefinition().object))(
        _pointers,
        renderer.getPartRenderer(fixture),
        fixture.x,
        fixture.y);
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

    const addPath = entry => _paths.push(entry);

    const analyze = () => {
        for (const fixture of pcb.getFixtures()) {
            const entry = new PartEntry(fixture);
            let outPins = 0;

            for (const pin of entry.getPins()) if (pin.type === Pin.TYPE_OUT)
                ++outPins;

            _parts.push(entry);
            _outPins += outPins;
        }
    };

    const makeOutputs = () => {
        let pinOffset = 1;

        for (const part of _parts)
            pinOffset += part.registerPins(pcb, addPath, pinOffset);
    };

    const connectInputs = () => {
        for (const part of _parts)
            part.connectInputs(_paths);
    };

    const orderIsolated = (parts, result) => {
        for (const part of parts)
            result.push(part);
    };

    const orderUnsatisfied = (parts, unsatisfied, result) => {
        let newRoot = unsatisfied[0];

        for (const entry of unsatisfied) if (entry.getRequiredOutputs() > newRoot.getRequiredOutputs())
            newRoot = entry;

        parts.splice(parts.indexOf(newRoot), 1);

        return order(parts, [newRoot], result);
    };

    const order = (parts, queue, result) => {
        const unsatisfied = [];

        if (!parts) {
            parts = _parts.slice();
            queue = [];
            result = [];
        }

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

            result.unshift(part);
        }

        if (unsatisfied.length > 0)
            return orderUnsatisfied(parts, unsatisfied, result);

        orderIsolated(parts, result);

        return result;
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
        const ordered = order();
        const states = [];

        for (const entry of ordered)
            states.push(entry.makeState(pcb, renderer));

        return states;
    };

    /**
     * Get the array of pin pointers of a given fixture.
     * @param {Fixture} fixture A fixture that exists on the PCB this graph was created from.
     * @returns {Array} An array of pin pointers pointing towards pins in the state array used by this fixtures' part.
     */
    this.getPinPointers = fixture => {
        for (const part of _parts) if (part.getFixture() === fixture)
            return part.getPointers();

        return null;
    };

    build();
}