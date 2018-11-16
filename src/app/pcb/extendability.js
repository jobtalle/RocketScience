/**
 * An extendability profile for a PCB.
 * This profile determines in which directions the PCB can be extended. This is unconstrained by default.
 * @constructor
 */
export function Extendability() {
    let _state = Extendability.BIT_LEFT | Extendability.BIT_UP | Extendability.BIT_RIGHT | Extendability.BIT_DOWN;

    /**
     * Check whether extending to the left is allowed.
     * @returns {Boolean} A boolean indicating whether extending to the left is possible.
     */
    this.getLeft = () => (_state & Extendability.BIT_LEFT) !== 0;

    /**
     * Set whether extending to the left is allowed.
     * @param {Boolean} extendable A boolean indicating whether extending to the left is allowed.
     */
    this.setLeft = extendable => {
        if (extendable)
            _state |= Extendability.BIT_LEFT;
        else
            _state &= ~Extendability.BIT_LEFT;
    };

    /**
     * Check whether extending up is allowed.
     * @returns {Boolean} A boolean indicating whether extending up is possible.
     */
    this.getUp = () => (_state & Extendability.BIT_UP) !== 0;

    /**
     * Set whether extending up is allowed.
     * @param {Boolean} extendable A boolean indicating whether extending up is allowed.
     */
    this.setUp = extendable => {
        if (extendable)
            _state |= Extendability.BIT_UP;
        else
            _state &= ~Extendability.BIT_UP;
    };

    /**
     * Check whether extending to the right is allowed.
     * @returns {Boolean} A boolean indicating whether extending to the right is possible.
     */
    this.getRight = () => (_state & Extendability.BIT_RIGHT) !== 0;

    /**
     * Set whether extending to the right is allowed.
     * @param {Boolean} extendable A boolean indicating whether extending to the right is allowed.
     */
    this.setRight = extendable => {
        if (extendable)
            _state |= Extendability.BIT_RIGHT;
        else
            _state &= ~Extendability.BIT_RIGHT;
    };

    /**
     * Check whether extending down is allowed.
     * @returns {Boolean} A boolean indicating whether extending down is possible.
     */
    this.getDown = () => (_state & Extendability.BIT_DOWN) !== 0;

    /**
     * Set whether extending down is allowed.
     * @param {Boolean} extendable A boolean indicating whether extending down is allowed.
     */
    this.setDown = extendable => {
        if (extendable)
            _state |= Extendability.BIT_DOWN;
        else
            _state &= ~Extendability.BIT_DOWN;
    };

    /**
     * Copy this extendability profile.
     * @returns {Extendability} A new extendability profile.
     */
    this.copy = () => {
        const extendability = new Extendability();

        extendability.setLeft(this.getLeft());
        extendability.setUp(this.getUp());
        extendability.setRight(this.getRight());
        extendability.setDown(this.getDown());

        return extendability;
    };

    /**
     * Serialize this extendability profile to a buffer.
     * @param {ByteBuffer} buffer A byte buffer.
     */
    this.serialize = buffer => {
        buffer.writeByte(_state);
    };

    /**
     * Deserialize this extendability profile from a buffer.
     * @param {ByteBuffer} buffer A byte buffer.
     */
    this.deserialize = buffer => {
        _state = buffer.readByte();
    };
}

Extendability.BIT_LEFT = 0x01;
Extendability.BIT_UP = 0x02;
Extendability.BIT_RIGHT = 0x04;
Extendability.BIT_DOWN = 0x08;