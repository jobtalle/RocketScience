export function OscillatorBehavior() {
    /**
     * Make a deep copy.
     * @returns {OscillatorBehavior} A deep copy of this OscillatorBehavior.
     */
    this.copy = () => {
        return new OscillatorBehavior();
    };
}