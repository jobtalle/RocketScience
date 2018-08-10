export function Led() {
    /**
     * Make a deep copy.
     * @returns {Led} A deep copy of this Led.
     */
    this.copy = () => {
        return new Led();
    }
}