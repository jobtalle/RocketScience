import {Fixture} from "../../part/fixture";
import {Part} from "../../part/part";
import Myr from "myr.js"

/**
 * A point on a pcb which may contain (part of) a component.
 * @constructor
 */
export function PcbPoint() {
    this.part = null;
    this.paths = 0;
}

/**
 * Set this point as locked. Locked points may not be removed.
 */
PcbPoint.prototype.lock = function() {
    this.paths |= PcbPoint.BIT_LOCKED;
};

/**
 * Set this point as unlocked. Unlocked points may be removed.
 */
PcbPoint.prototype.unlock = function() {
    this.paths &= !PcbPoint.BIT_LOCKED;
};

/**
 * Mark this point as an input connection.
 */
PcbPoint.prototype.connectInput = function() {
    this.paths |= PcbPoint.CONNECTION_BIT_INPUT;
};

/**
 * Mark this point as an output connection.
 */
PcbPoint.prototype.connectOutput = function() {
    this.paths |= PcbPoint.CONNECTION_BIT_OUTPUT;
};

/**
 * Mark this point as a structural connection.
 */
PcbPoint.prototype.connectStructural = function() {
    this.paths |= PcbPoint.CONNECTION_BIT_STRUCTURAL;
};

/**
 * Check if an input pin is connected to this point.
 * @returns {Boolean} A boolean which is true when this point is connected to an input pin.
 */
PcbPoint.prototype.isInput = function() {
    return (this.paths & PcbPoint.CONNECTION_BIT_INPUT) === PcbPoint.CONNECTION_BIT_INPUT;
};

/**
 * Check if an output pin is connected to this point.
 * @returns {Boolean} A boolean which is true when this point is connected to an output pin.
 */
PcbPoint.prototype.isOutput = function() {
    return (this.paths & PcbPoint.CONNECTION_BIT_OUTPUT) === PcbPoint.CONNECTION_BIT_OUTPUT;
};

/**
 * Check if a pin is connected to this point.
 * @returns {Boolean} A boolean which is true when this point is connected to a pin.
 */
PcbPoint.prototype.isConnected = function() {
    return (this.paths & PcbPoint.CONNECTION_BITS) !== 0;
};

/**
 * Check if this point is locked.
 * @returns {Boolean} A boolean indicating whether this point is locked.
 */
PcbPoint.prototype.isLocked = function() {
    return (this.paths & PcbPoint.BIT_LOCKED) !== 0;
};

/**
 * Mark this point as unconnected.
 */
PcbPoint.prototype.disconnect = function() {
    this.paths &= ~PcbPoint.CONNECTION_BITS;
};

/**
 * Etch a path in a direction onto this point.
 * @param {Number} direction A direction in the range [0, 7].
 */
PcbPoint.prototype.etchDirection = function(direction) {
    this.paths |= 1 << direction;
};

/**
 * Check whether a direction has been etched onto this point.
 * @param {Number} direction A direction in the range [0, 7].
 * @returns {Boolean} A boolean which is true if the point contains this direction.
 */
PcbPoint.prototype.hasDirection = function(direction) {
    return ((this.paths >> direction) & 0x01) === 1;
};

/**
 * Remove an etched path in a direction from this point.
 * @param {Number} direction A direction in the range [0, 7].
 */
PcbPoint.prototype.clearDirection = function(direction) {
    this.paths &= ~(1 << direction);
};

/**
 * Check whether the paths on this point form a junction or terminal.
 * @returns {Boolean} A boolean indicating whether this point is a junction or terminal.
 */
PcbPoint.prototype.isJunction = function() {
    if (this.isConnected())
        return true;

    let count = 0;

    for (let bit = 0; bit < 8; ++bit) {
        count += (this.paths >> bit) & 1;

        if (count > 2)
            return true;
    }

    return count < 2;
};

/**
 * Check whether a certain direction has been etched onto this point.
 * @param {Number} direction A direction in the range [0, 7].
 * @returns {Boolean} A boolean which is true when the given direction is etched onto this point.
 */
PcbPoint.prototype.hasDirection = function(direction) {
    return ((this.paths >> direction) & 1) === 1;
};

/**
 * Check whether this point has paths etched into it.
 * @returns {Boolean} A boolean which is True if this point has paths etched into it.
 */
PcbPoint.prototype.hasPaths = function() {
    return (this.paths & PcbPoint.PATHS_MASK) !== 0;
};

/**
 * Combine this points paths with another points paths.
 * @param {PcbPoint} point A PCB point.
 */
PcbPoint.prototype.flatten = function(point) {
    this.paths |= (point.paths & PcbPoint.PATHS_MASK);
};

/**
 * Check whether this point's paths overlap another point's paths.
 * @param {PcbPoint} point A PCB point.
 * @returns {Boolean} A boolean which indicates whether the points have overlapping paths.
 */
PcbPoint.prototype.pathOverlaps = function(point) {
    return ((this.paths & point.paths) & PcbPoint.PATHS_MASK) !==0;
};

/**
 * Check whether this point's path equals another point's paths.
 * @param {PcbPoint} point A PCB point.
 * @returns {Boolean} A boolean which indicates whether the points have equal paths.
 */
PcbPoint.prototype.pathEquals = function(point) {
    return ((this.paths & point.paths) & PcbPoint.PATHS_MASK) === (point.paths & PcbPoint.PATHS_MASK);
};

/**
 * Erase this points connections overlapping with another points connections.
 * @param {PcbPoint} point A point to erase overlapping paths from.
 */
PcbPoint.prototype.erasePaths = function(point) {
    this.paths &= ~(point.paths & PcbPoint.PATHS_MASK);
};

/**
 * Execute a function for all connected points.
 * @param {Function} f A function taking an x and y coordinate of a connected point and the direction it came from.
 * @param {Number} [exclude] An optional direction to exclude from executing.
 */
PcbPoint.prototype.withConnected = function(f, exclude) {
    for (let direction = 0; direction < 8; ++direction) {
        if (exclude === direction)
            continue;

        if (((this.paths >> direction) & 1) === 1) {
            const delta = PcbPoint.directionToDelta(direction);

            f(delta.x, delta.y, PcbPoint.invertDirection(direction));
        }
    }
};

/**
 * Serialize this PCB point to a buffer.
 * @param {ByteBuffer} buffer A byte buffer to serialize this PCB point to.
 * @param {Array} encodedParts An array of already encoded parts.
 * @param {Boolean} isChain A boolean indicating whether a next point comes directly after this one.
 * @param {Boolean} isLast A boolean indicating whether this point is the last point on a PCB.
 */
PcbPoint.prototype.serialize = function(buffer, encodedParts, isChain, isLast) {
    let byte = isChain?PcbPoint.SERIALIZE_BIT_CHAIN:0;

    for (let direction = 1; direction < 5; ++direction) if (this.hasDirection(direction))
        byte |= 1 << (direction - 1);

    if (isLast)
        byte |= PcbPoint.SERIALIZE_BIT_LAST;

    if (this.isLocked())
        byte |= PcbPoint.SERIALIZE_BIT_LOCKED;

    if (this.part !== null && !encodedParts.includes(this.part)) {
        encodedParts.push(this.part);

        buffer.writeByte(byte | PcbPoint.SERIALIZE_BIT_PART);

        this.part.serialize(buffer);
    }
    else
        buffer.writeByte(byte);
};

/**
 * Deserialize this PCB point from a buffer.
 * @param {ByteBuffer} buffer A byte buffer to serialize this PCB point from.
 * @param {Array} fixtures An array to place new fixtures in.
 * @param {Number} x The points x coordinate.
 * @param {Number} y The points y coordinate.
 * @param {Pcb} pcb The pcb this point is a part of.
 * @param {PcbPoint.DeserializationReport} [report] An optional deserialization report.
 * @returns {PcbPoint} The deserialized PCB point.
 */
PcbPoint.deserialize = function(buffer, fixtures, x, y, pcb, report) {
    const point = new PcbPoint();
    const byte = buffer.readByte();

    for (let direction = 1; direction < 5; ++direction) if (((byte >> (direction - 1)) & 1) === 1) {
        const delta = PcbPoint.directionToDelta(direction);

        point.etchDirection(direction);
        pcb.getPoint(x + delta.x, y + delta.y).etchDirection(PcbPoint.invertDirection(direction));
    }

    if ((byte & PcbPoint.SERIALIZE_BIT_PART) !== 0)
        fixtures.push(new Fixture(Part.deserialize(buffer), x, y));

    if ((byte & PcbPoint.SERIALIZE_BIT_LOCKED) !== 0)
        point.lock();

    if (report) {
        if ((byte & PcbPoint.SERIALIZE_BIT_LAST) !== 0)
            report.state = PcbPoint.DESERIALIZE_STATE_LAST;
        else if ((byte & PcbPoint.SERIALIZE_BIT_CHAIN) !== 0)
            report.state = PcbPoint.DESERIALIZE_STATE_CHAIN;
        else
            report.state = PcbPoint.DESERIALIZE_STATE_EMPTY;
    }

    return point;
};

PcbPoint.DeserializationReport = function() {
    this.state = PcbPoint.DESERIALIZE_STATE_EMPTY;
};

const directionDeltas = [
    new Myr.Vector(1, 0),
    new Myr.Vector(1, -1),
    new Myr.Vector(0, -1),
    new Myr.Vector(-1, -1),
    new Myr.Vector(-1, 0),
    new Myr.Vector(-1, 1),
    new Myr.Vector(0, 1),
    new Myr.Vector(1, 1)
];

/**
 * Get the X and Y offset to a neighbor based on direction.
 * @param {Number} direction A direction in the range [0, 7].
 * @returns {Myr.Vector} A vector containing the offset to the neighbor.
 */
PcbPoint.directionToDelta = direction => directionDeltas[direction];

/**
 * Get the direction based on offset.
 * @param {Number} dx The X offset.
 * @param {Number} dy The Y offset.
 * @returns {Number} A direction in the range [0, 7].
 */
PcbPoint.deltaToDirection = (dx, dy) => {
    if (dx === 1)
        return -dy - (Math.min(-dy, 0) << 3);

    return 4 + ((1 + dx) + 1) * dy;
};

/**
 * Invert a direction, which means adding 180 degrees to it.
 * @param {Number} direction A direction in the range [0, 7].
 * @returns {Number} The inverted direction in the range [0, 7].
 */
PcbPoint.invertDirection = direction => (direction + 4) % 8;

/**
 * Increment a direction by one (counter clockwise).
 * @param {Number} direction A direction in the range [0, 7].
 * @returns {Number} The incremented direction in the range [0, 7].
 */
PcbPoint.incrementDirection = direction => (direction + 1) % 8;

/**
 * Decrement a direction by one (clockwise).
 * @param {Number} direction A direction in the range [0, 7].
 * @returns {Number} The decremented direction in the range [0, 7].
 */
PcbPoint.decrementDirection = direction => direction === 0?7:direction - 1;

PcbPoint.PATHS_MASK = 0xFF;
PcbPoint.BIT_LOCKED = 0x800;
PcbPoint.CONNECTION_BIT_OUTPUT = 0x100;
PcbPoint.CONNECTION_BIT_INPUT = 0x200;
PcbPoint.CONNECTION_BIT_STRUCTURAL = 0x400;
PcbPoint.CONNECTION_BITS =
    PcbPoint.CONNECTION_BIT_OUTPUT |
    PcbPoint.CONNECTION_BIT_INPUT |
    PcbPoint.CONNECTION_BIT_STRUCTURAL;
PcbPoint.SERIALIZE_BIT_CHAIN = 0x10;
PcbPoint.SERIALIZE_BIT_PART = 0x20;
PcbPoint.SERIALIZE_BIT_LAST = 0x40;
PcbPoint.SERIALIZE_BIT_LOCKED = 0x80;
PcbPoint.SERIALIZE_BITS_SKIP = PcbPoint.SERIALIZE_BIT_CHAIN | PcbPoint.SERIALIZE_BIT_LAST;
PcbPoint.DESERIALIZE_STATE_LAST = 0;
PcbPoint.DESERIALIZE_STATE_CHAIN = 1;
PcbPoint.DESERIALIZE_STATE_EMPTY = 2;