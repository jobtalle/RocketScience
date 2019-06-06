/**
 * A story is a collection of MissionProgress objects, with a logical order.
 * @param {JSON} story A json story object, loaded from the missions file.
 * @param {Array} missions An array with MissionProgress objects.
 * @constructor
 */
export function Story(story, missions) {

    /**
     * Get the story JSON, originating from the missions file. Can be used to reload the mission.
     * @return {JSON}
     */
    this.getStory = () => story;

    /**
     * Get the ordered MissionProgress objects
     * @return {Array} An array of MissionProgress objects.
     */
    this.getMissions = () => missions;
}