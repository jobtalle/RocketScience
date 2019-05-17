/**
 * A wrapper for Mission, which also stores the progress and a unique hash for the mission.
 * @param mission {Mission} A mission
 * @param progress {Number} An int variable which states the progression of the mission.
 * @constructor
 */
export function MissionProgress(mission, progress) {
    this.getMission = () => mission;

    this.getProgress = () => progress;
}

MissionProgress.PROGRESS_UNBEGUN = 0;
MissionProgress.PROGRESS_INCOMPLETE = 1;
MissionProgress.PROGRESS_COMPLETE = 2;