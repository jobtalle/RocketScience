/**
 * Basic priority queue. Implements push and pop functionality. Nodes must have a "getPrio" function for sorting.
 * Lowest priority values are popped first.
 * @constructor
 */
export function PriorityQueue() {
    const _queue = [];

    /**
     * Push a new node onto the queue.
     * @param {Object} node A node which implements a "getPrio()" method.
     */
    this.push = node => {
        for (let i = 0; i < _queue.length; ++i)
            if (_queue[i].getPrio() < node.getPrio()) {
                _queue.splice(i, 0, node);

                return;
            }

        _queue.push(node);
    };

    /**
     * Pop a node from the queue and return it.
     * @returns {Object} A node which implements a "getPrio()" method.
     */
    this.pop = () => _queue.pop();

    /**
     * Return true if the queue is empty.
     * @returns {Boolean} Whether the queue is empty.
     */
    this.isEmpty = () => _queue.length === 0;

    /**
     * Return the number of nodes in the queue.
     * @returns {Number} The number of nodes in the queue.
     */
    this.size = () => _queue.length;
}
