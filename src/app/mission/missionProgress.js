/**
 * A wrapper for Mission, which also stores the progress and a unique hash for the mission.
 * @param mission {Mission} A mission
 * @param progress {Number} An int variable which states the progression of the mission.
 * @constructor
 */
export function MissionProgress(mission, progress) {
    /**
     * Obtain the mission object.
     * @return {Mission} The mission.
     */
    this.getMission = () => mission;

    /**
     * Obtain the mission progress.
     * @return {Number} A number which indicates the progress, 0 for none, 1 for incomplete, 2 for completed.
     */
    this.getProgress = () => progress;
}

MissionProgress.PROGRESS_UNBEGUN = 0;
MissionProgress.PROGRESS_INCOMPLETE = 1;
MissionProgress.PROGRESS_COMPLETE = 2;