export function GateAndBehavior() {
    /**
     * Make a deep copy.
     * @returns {GateAndBehavior} A deep copy of this or gate behavior.
     */
    this.copy = () => {
        return new GateAndBehavior();
    };
}