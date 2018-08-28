export function BatteryBehavior() {
    /**
     * Make a deep copy.
     * @returns {BatteryBehavior} A deep copy of this BatteryBehavior.
     */
    this.copy = () => {
        return new BatteryBehavior();
    };
}