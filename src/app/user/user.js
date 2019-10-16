import {Cookie} from "../storage/cookie";
import {AvatarSprites} from "./avatarSprites";
import missions from "../../assets/missions.json"
import {Data} from "../file/data";
import {requestBinary} from "../utils/requestBinary";
import {Mission} from "../mission/mission";
import {WebStorage} from "../storage/webStorage";
import {MissionProgress} from "../mission/missionProgress";
import {Story} from "../mission/story";
import {Languages} from "../text/language";

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

    const loadMissionProgress = (filePath, onLoad, onError) => {
        if (hasSavedMission(filePath)) {
            onLoad(new MissionProgress(getSavedMission(filePath),
                _webStorage.isMissionCompleted(filePath),
                true,
                filePath));

        } else { // Load mission from binary file
            requestBinary(filePath,
                (result) => {
                    const data = new Data();

                    data.setBlob(result, () => onLoad(new MissionProgress(
                        Mission.deserialize(data.getBuffer()),
                        _webStorage.isMissionCompleted(filePath),
                        false,
                        filePath)));
                },
                () => onError("could not parse mission " + filePath)
            );
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
     * @param {MissionProgress} missionProgress MissionProgress object.
     */
    this.clearMission = (missionProgress) => {
        _webStorage.clearMissionProgress(missionProgress.getFileName());
    };

    /**
     * Get the number of stories.
     * @return {Number} Number of stories.
     */
    this.getStoryCount = () => {
        return missions.stories.length;
    };

    /**
     * Load one singular story.
     * @param {JSON} story A JSON object of the story.
     * @param {Function} onLoad A function that is called when the story is loaded, with the story.
     * @param {Function} onError A function that is called then there is an error.
     */
    this.loadStory = (story, onLoad, onError) => {
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
                onLoad(new Story(story, getOrderedMissions()));
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
     * Get the language file used by this user.
     * @returns {String} The language file.
     */
    this.getLanguage = () => {
        return Languages.DUTCH;
    };

    /**
     * Get all mods currently active for this user.
     * @returns {string[]} An array of mod files.
     */
    this.getMods = () => {
        return [
            "mods/base.zip"
        ];
    };

    /**
     * Load all the stories, containing the missions.
     * @param {Function} onLoad Callback function, called for every loaded story, with the story and the index.
     * @param {Function} onComplete Callback function, called when everything is finished.
     * @param {Function} onError Callback function, called when a story returns an error.
     */
    this.loadStories = (onLoad, onComplete, onError) => {
        let loaded = 0;

        const checkIfComplete = () => {
            if (loaded === missions.stories.length)
                onComplete();
        };

        for (const story of missions.stories) {
            this.loadStory(story,
                (result) => {
                    onLoad(result, missions.stories.indexOf(story));
                    ++loaded;
                    checkIfComplete();
                },
                (error) => {
                    onError(error, missions.stories.indexOf(story));
                    ++loaded;
                    checkIfComplete();
                });
        }
    };

    /**
     * Store the missionProgress progress in the storage.
     * @param {MissionProgress} missionProgress The missionProgress that has to be saved.
     * @param {Function} onComplete The function that should be called when the saving is finished.
     */
    this.saveMissionProgress = (missionProgress, onComplete) => {
        setSavedMission(missionProgress.getFileName(), missionProgress.getMission());

        if (missionProgress.isCompleted())
            _webStorage.setMissionCompleted(missionProgress.getFileName());

        onComplete(true);
    };

    /**
     * Just set a mission to completed.
     * @param {MissionProgress} missionProgress The mission progress.
     */
    this.saveMissionCompleted = (missionProgress) => {
        _webStorage.setMissionCompleted(missionProgress.getFileName());
    };

    loadUserFromCookie();
}

User.ID_ANONYMOUS_USER = -1;
User.KEY_MISSION_PROGRESS = "progression";