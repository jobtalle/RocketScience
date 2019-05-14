/**
 * Exponential approach.
 * @param {Number} value The initial value.
 * @param {Number} target The initial target value.
 * @param {Number} rate The remaining delta after one second of approach.
 * @constructor
 */
export function ExponentialApproach(value, target, rate) {
    const _lambda = Math.log(rate);

    /**
     * Update the motion.
     * @param {Number} timeStep The current time step.
     */
    this.update = timeStep => {
        value += (target - value) * (1 - Math.exp(_lambda * timeStep));
    };

    /**
     * Get the current value.
     * @returns {Number} The current value.
     */
    this.getValue = () => value;

    /**
     * Set the current target.
     * @param {Number} newTarget The new target value.
     */
    this.setTarget = newTarget => target = newTarget;

    /**
     * Set the current value.
     * @param {Number} newValue The new value.
     */
    this.setValue = newValue => value = newValue;
}