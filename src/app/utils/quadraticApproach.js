/**
 * A quadratic approach.
 * @param {Number} value The initial value.
 * @param {Number} target The initial target value.
 * @param {Number} min The lower bound.
 * @param {Number} max The upper bound.
 * @constructor
 */
export function QuadraticApproach(value, target, min, max) {
    /**
     * Update the motion.
     * @param {Number} timeStep The current time step.
     */
    this.update = timeStep => {
        const delta = target - value;

        value += delta * Math.pow(QuadraticApproach.DAMPING, timeStep);

        if (value < min)
            value = min;
        else if (value > max)
            value = max;

        value = target;
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
}

QuadraticApproach.DAMPING = 0.0005;