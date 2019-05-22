/**
 * A story is a collection of MissionProgress objects, with a logical order.
 * @param {Array} missions MissionProgress array
 * @constructor
 */
export function Story(missions) {
    const _dependencies = [];

    /**
     * Get the ordered MissionProgress objects
     * @return {Array} An array of MissionProgress objects.
     */
    this.getMissions = () => missions;
}