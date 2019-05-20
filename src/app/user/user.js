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
        return _webStorage.getItem(mission) != null;
    };

    const getSavedMission = (mission) => {
        return _webStorage.getItem(mission);
    };

    const setSavedMission = (key, mission) => {
        return _webStorage.setItem(key, mission.toString());
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
     * Get the mission progresses, holding a mission and progress. This is returned through the onLoaded function.
     * @param onLoaded {Function} The onComplete function that should be called when a mission is loaded.
     */
    this.loadMissionProgresses = (onLoaded) => {
        for (const category of missions.categories) {
            for (const mission of category.missions) {
                const loadData = new Data();

                if (hasSavedMission(mission)) {
                    loadData.fromString(getSavedMission(mission));

                    // TODO: load from a progress key

                    const missionProgress = new MissionProgress(Mission.deserialize(loadData.getBuffer()),
                        MissionProgress.PROGRESS_INCOMPLETE);
                } else {
                    requestBinary(mission, (result) => {
                        loadData.setBlob(result, () => {
                            const missionProgress = new MissionProgress(Mission.deserialize(loadData.getBuffer()),
                                MissionProgress.PROGRESS_UNBEGUN);

                            onLoaded(missionProgress);
                        });
                    }, () => {
                        console.log("could not parse mission " + mission);
                    });
                }
            }
        }
    };

    /**
     * Store the mission progress in the storage.
     * @param missionName {String} The name of the mission.
     * @param missionProgress {Mission} The mission that should be stored.
     * @param onComplete {Function} The function that should be called when the saving is finished.
     */
    this.saveMissionProgress = (missionName, missionProgress, onComplete) => {
        setSavedMission(missionName, missionProgress);
        onComplete(true);
    };

    loadUserFromCookie();
}

User.ID_ANONYMOUS_USER = -1;
User.KEY_MISSION_PROGRESS = "progression";