/**
 * A wrapper for Mission, which also stores the progress and a unique hash for the mission.
 * @param {Mission} mission A mission.
 * @param {Boolean} isCompleted A boolean to state if the mission has been completed.
 * @param {Boolean} hasSavedState A boolean tp state is there is a saved state for this mission.
 * @param {String} fileName The fileName of the mission.
 * @constructor
 */
export function MissionProgress(mission, isCompleted, hasSavedState, fileName) {
    /**
     * Obtain the mission object.
     * @return {Mission} The mission.
     */
    this.getMission = () => mission;

    /**
     * Check if the mission has been completed.
     * @return {Boolean} True is the mission has been completed at some time.
     */
    this.isCompleted = () => isCompleted;

    /**
     * Check if the mission has some saved state.
     * @return {Boolean} True if the mission has saved state.
     */
    this.hasSavedState = () => hasSavedState;

    /**
     * Get the filename
     * @return {String}
     */
    this.getFileName = () => fileName;
}