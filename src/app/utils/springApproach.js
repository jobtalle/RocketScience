/**
 * An underdamped spring approaching a value.
 * @param {Number} value The initial value.
 * @param {Number} target The initial target value.
 * @param {Number} min The lower bound.
 * @param {Number} max The upper bound.
 * @constructor
 */
export function SpringApproach(value, target, min, max) {
    let _momentum = 0;

    /**
     * Update the motion.
     * @param {Number} timeStep The current time step.
     */
    this.update = timeStep => {
        const delta = target - value;

        _momentum = _momentum * SpringApproach.SPRING_DAMPING + delta * SpringApproach.SPRING_FORCE;
        value += _momentum;

        if (value < min) {
            value = min;

            _momentum = 0;
        }
        else if (value > max) {
            value = max;

            _momentum = 0;
        }
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
    this.setTarget = newTarget => {
        target = newTarget;
    };
}

SpringApproach.SPRING_FORCE = 0.2;
SpringApproach.SPRING_DAMPING = 0.7;