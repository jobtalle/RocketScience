/**
 * Basic priority queue. Implements push and pop functionality. Nodes must have a "getPrio" function for sorting.
 * Lowest priority values are popped first.
 * @constructor
 */
export function PriorityQueue() {
    const _queue = [];

    this.push = node => {
        for (let i = 0; i < _queue.length; ++i)
            if (_queue[i].getPrio() < node.getPrio()) {
                _queue.splice(i, 0, node);

                return;
            }

        _queue.push(node);
    };

    this.pop = () => _queue.pop();

    this.isEmpty = () => _queue.length === 0;
}
