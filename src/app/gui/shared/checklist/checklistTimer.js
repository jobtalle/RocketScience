/**
 * A time tracking device for the checklist.
 * @constructor
 */
export function ChecklistTimer() {
    let _startTime = null;

    /**
     * Set the start time to the current system time.
     */
    this.start = () => {
        _startTime = new Date();
    };

    /**
     * Get the current time in seconds.
     * @returns {Number} The elapsed time. Returns -1 when the timer was not started.
     */
    this.getTime = () => {
        if (_startTime)
            return (new Date() - _startTime) * 0.001;

        return -1;
    }
}