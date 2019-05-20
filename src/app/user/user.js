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

                if (hasSavedMission(mission.title)) {
                    const missionProgress = new MissionProgress(getSavedMission(mission.title),
                        MissionProgress.PROGRESS_INCOMPLETE);

                    onLoaded(missionProgress);
                } else {
                    requestBinary(mission.file, (result) => {
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
     * @param mission {Mission} The mission that has to be saved.
     * @param onComplete {Function} The function that should be called when the saving is finished.
     */
    this.saveMissionProgress = (mission, onComplete) => {
        setSavedMission(mission.getTitle(), mission);
        onComplete(true);
    };

    loadUserFromCookie();
}

User.ID_ANONYMOUS_USER = -1;
User.KEY_MISSION_PROGRESS = "progression";