/**
 * A loader task
 * @param {Function} task A function to perform, which takes an onFinished function as a parameter.
 * @constructor
 */
export function LoaderTask(task) {
    /**
     * Perform this task.
     * @param {Function} onFinished A function to call when the task has finished.
     */
    this.perform = onFinished => {
        task(onFinished);
    };
}