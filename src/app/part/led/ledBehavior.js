export function LedBehavior() {
    /**
     * Make a deep copy.
     * @returns {LedBehavior} A deep copy of this LedBehavior.
     */
    this.copy = () => {
        return new LedBehavior();
    }
}