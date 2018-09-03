export function WheelBehavior() {
    /**
     * Make a deep copy.
     * @returns {WheelBehavior} A deep copy of this OscillatorBehavior.
     */
    this.copy = () => {
        return new WheelBehavior();
    };
}