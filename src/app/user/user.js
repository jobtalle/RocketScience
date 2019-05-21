import {Cookie} from "../storage/cookie";
import {AvatarSprites} from "./avatarSprites";
import missions from "../../assets/missions.json"
import {Data} from "../file/data";
import {requestBinary} from "../utils/requestBinary";
import {Mission} from "../mission/mission";
import {WebStorage} from "../storage/webStorage";
import {MissionProgress} from "../mission/missionProgress";

/**
 * The user information stored locally and online.
 * @constructor
 */
export function User() {
    let _id = User.ID_ANONYMOUS_USER;
    let _avatarSprites = new AvatarSprites();
    let _webStorage = new WebStorage();

    const loadUserFromCookie = () => {
        const cookie = new Cookie();

        if (cookie.hasValue(Cookie.KEY_USER_ID))
            _id = cookie.getValue(Cookie.KEY_USER_ID);
        else
            cookie.setValue(Cookie.KEY_USER_ID, _id);
    };

    const hasSavedMission = (mission) => {
        return _webStorage.getMissionProgress(mission) != null;
    };

    const getSavedMission = (mission) => {
        const data = new Data();
        data.fromString(_webStorage.getMissionProgress(mission));

        return Mission.deserialize(data.getBuffer())
    };

    const setSavedMission = (name, mission) => {
        const data = new Data();
        mission.serialize(data.getBuffer());

        _webStorage.saveMissionProgress(name, data.toString())
    };

    const getMissionProgression = (missionName) => {
        if (_webStorage.isMissionCompleted(missionName))
            return MissionProgress.PROGRESS_COMPLETE;

        return MissionProgress.PROGRESS_INCOMPLETE;
    };

    /**
     * Set the user ID of the user.
     * @param userId {Number} The user ID.
     */
    this.setUserId = (userId) => {
        _id = userId;

        new Cookie().setValue(Cookie.KEY_USER_ID, _id);
    };

    /**
     * Obtain the user ID.
     * @returns {Number} The user ID.
     */
    this.getUserId = () => _id;

    /**
     * Obtain the sprites for the avatar
     * @returns {AvatarSprites} The AvatarSprites object.
     */
    this.getAvatarSprites = () => _avatarSprites;


    /**
     * Clear a mission with the given name. This will not revert completion status.
     * @param missionName {String} Name of the mission.
     */
    this.clearMission = (missionName) => {
        _webStorage.clearMissionProgress(missionName);
    };

    /**
     * Get the mission progresses, holding a mission and progress. This is returned through the onLoaded function.
     * @param onLoaded {Function} The onLoaded function will be called per mission that is loaded.
     * @param onError {Function} This will be called when an error occurs.
     */
    this.loadMissionProgresses = (onLoaded, onError) => {
        for (const category of missions.categories) {
            for (const mission of category.missions) {

                if (hasSavedMission(mission.title)) {
                        onLoaded(new MissionProgress(getSavedMission(mission.title),
                            getMissionProgression(mission.title)));

                } else { // Load mission from binary file
                    requestBinary(mission.file,
                        (result) => {
                            const data = new Data();

                            data.setBlob(result, () => onLoaded(new MissionProgress(
                                Mission.deserialize(data.getBuffer()),
                                _webStorage.isMissionCompleted(mission.title) ? MissionProgress.PROGRESS_COMPLETE :
                                    MissionProgress.PROGRESS_UNBEGUN)));
                    },
                        () => onError("could not parse mission " + mission)
                    );
                }
            }
        }
    };

    /**
     * Store the missionProgress progress in the storage.
     * @param missionProgress {MissionProgress} The missionProgress that has to be saved.
     * @param onComplete {Function} The function that should be called when the saving is finished.
     */
    this.saveMissionProgress = (missionProgress, onComplete) => {
        setSavedMission(missionProgress.getMission().getTitle(), missionProgress.getMission());

        if (missionProgress.getProgress() === MissionProgress.PROGRESS_COMPLETE ||
            _webStorage.isMissionCompleted(missionProgress.getMission().getTitle()))
            _webStorage.setMissionCompleted(missionProgress.getMission().getTitle());
        else
            _webStorage.setMissionIncomplete(missionProgress.getMission().getTitle());

        onComplete(true);
    };

    loadUserFromCookie();
}

User.ID_ANONYMOUS_USER = -1;
User.KEY_MISSION_PROGRESS = "progression";