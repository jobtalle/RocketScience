export function GateOrBehavior() {
    /**
     * Make a deep copy.
     * @returns {GateOrBehavior} A deep copy of this or gate behavior.
     */
    this.copy = () => {
        return new GateOrBehavior();
    };
}