export function GateNotBehavior() {
    /**
     * Make a deep copy.
     * @returns {GateNotBehavior} A deep copy of this or gate behavior.
     */
    this.copy = () => {
        return new GateNotBehavior();
    };
}