/**
 * A loader that loads the game contents.
 * @param {Array} tasks A non-empty array of LoaderTask objects, which will be executed in order.
 * @param {Function} onFinished A function to execute when loading has finished.
 * @constructor
 */
export function Loader(tasks, onFinished) {
    const finishTask = () => {
        const next = tasks.pop();

        if (next)
            next.perform(finishTask);
        else
            onFinished();
    };

    /**
     * Perform all load tasks.
     */
    this.load = () => {
        tasks.pop().perform(finishTask);
    };

    tasks.reverse();
}