import {Cookie} from "../storage/cookie";
import {AvatarSprites} from "./avatarSprites";
import missions from "../../assets/missions.json"
import {Data} from "../file/data";
import {requestBinary} from "../utils/requestBinary";
import {Mission} from "../mission/mission";
import {WebStorage} from "../storage/webStorage";
import {MissionProgress} from "../mission/missionProgress";
import {Story} from "../mission/story";

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

    const loadMissionProgress = (filePath, onLoad, onError) => {
        if (hasSavedMission(filePath)) {
            onLoad(new MissionProgress(getSavedMission(filePath),
                getMissionProgression(filePath),
                filePath));

        } else { // Load mission from binary file
            requestBinary(filePath,
                (result) => {
                    const data = new Data();

                    data.setBlob(result, () => onLoad(new MissionProgress(
                        Mission.deserialize(data.getBuffer()),
                        _webStorage.isMissionCompleted(filePath) ? MissionProgress.PROGRESS_COMPLETE :
                            MissionProgress.PROGRESS_UNBEGUN,
                        filePath)));
                },
                () => onError("could not parse mission " + filePath)
            );
        }
    };

    const loadStory = (story, onComplete, onError) => {
        const missionNames = [];
        const missions = {};
        const errors = [];

        const getOrderedMissions = () => {
            const orderedMissions = [];
            missionNames.sort();

            for (const name of missionNames)
                orderedMissions.push(missions[name]);

            return orderedMissions;
        };

        const checkIfComplete = () => {
            if (story.missions.length === missionNames.length + errors.length)
                onComplete(new Story(getOrderedMissions()));
        };

        for (const mission of story.missions) {
            loadMissionProgress(mission.file,
                (missionProgress) => {
                    missionNames.push(missionProgress.getFileName());
                    missions[missionProgress.getFileName()] = missionProgress;

                    checkIfComplete();
                },
                (error) => {
                    errors.push(mission.file);
                    onError(error);

                    checkIfComplete();
                });
        }
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
     * Get the number of stories.
     * @return {Number} Number of stories.
     */
    this.getStoryCount = () => {
        return missions.stories.length;
    };

    /**
     * Load all the stories, containing the missions.
     * @param onLoad {Function} Callback function, called for every loaded story, with the story and the index.
     * @param onComplete {Function} Callback function, called when everything is finished.
     * @param onError {Function} Callback function, called when a story returns an error.
     */
    this.loadStories = (onLoad, onComplete, onError) => {
        let loaded = 0;

        const checkIfComplete = () => {
            if (loaded === missions.stories.length)
                onComplete();
        };

        let index = 0;
        for (const story of missions.stories) {
            ++index;

            loadStory(story,
                (result) => {
                    ++loaded;

                    onLoad(result, index);
                    checkIfComplete();
                },
                (error) => {
                    ++loaded;

                    onError(error, index);
                    checkIfComplete();
                });
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