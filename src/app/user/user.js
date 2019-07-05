import {Cookie} from "../storage/cookie";
import {AvatarSprites} from "./avatarSprites";
import missions from "../../assets/missions.json"
import {Data} from "../file/data";
import {requestBinary} from "../utils/requestBinary";
import {Mission} from "../mission/mission";
import {WebStorage} from "../storage/webStorage";
import {MissionProgress} from "../mission/missionProgress";
import {Story} from "../mission/story";
import {PcbStorage} from "./pcbStorage";
import {PcbStorageDrawer} from "./pcbStorageDrawer";

/**
 * The user information stored locally and online.
 * @constructor
 */
export function User() {
    let _id = User.ID_ANONYMOUS_USER;
    let _avatarSprites = new AvatarSprites();
    let _webStorage = new WebStorage();
    let _pcbStorage = null;

    const loadPcbStorage = () => {
        if (_webStorage.getPcbStorage()) {
            const data = new Data();
            data.fromString(_webStorage.getPcbStorage());
            _pcbStorage = PcbStorage.deserialize(data.getBuffer());
        }
        else {
            _pcbStorage = new PcbStorage();
            for (let index = 0; index < 5; ++index)
                _pcbStorage.addDrawer(new PcbStorageDrawer());
        }
    };

    const loadUserFromCookie = () => {
        const cookie = new Cookie();

        if (cookie.hasValue(Cookie.KEY_USER_ID))
            _id = cookie.getValue(Cookie.KEY_USER_ID);
        else
            cookie.setValue(Cookie.KEY_USER_ID, _id);

        loadPcbStorage();
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
     * Load all the stories, containing the missions.
     * @param {Function} onLoad Callback function, called for every loaded story, with the story and the index.
     * @param {Function} onComplete Callback function, called when everything is finished.
     * @param {Function} onError Callback function, called when a story returns an error.
     */
    this.loadStories = (onLoad, onComplete, onError) => {
        let index = 0;

        const checkIfComplete = () => {
            if (index === missions.stories.length)
                onComplete();
        };

        for (const story of missions.stories) {
            this.loadStory(story,
                (result) => {
                    onLoad(result, index++);
                    checkIfComplete();
                },
                (error) => {
                    onError(error, index++);
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

        if (missionProgress.getProgress() === MissionProgress.PROGRESS_COMPLETE ||
            _webStorage.isMissionCompleted(missionProgress.getFileName()))
            _webStorage.setMissionCompleted(missionProgress.getFileName());
        else
            _webStorage.setMissionIncomplete(missionProgress.getFileName());

        onComplete(true);
    };

    /**
     * Get the PcbStorage.
     * @return {PcbStorage} The PcbStorage.
     */
    this.getPcbStorage = () => _pcbStorage;

    /**
     * Store the PCB to storage.
     * @param {String} pcbName The name of the PCB.
     * @param {Pcb} pcb The PCB object.
     * @return {Boolean} True if the pcb is stored, false otherwise.
     */
    this.savePcb = (pcbName, pcb) => {
        for (const drawer of _pcbStorage.getDrawers()) {
            if (drawer.canAdd()) {
                drawer.addPcb(pcb);

                const data = new Data();

                _pcbStorage.serialize(data.getBuffer());
                _webStorage.savePcbStorage(data.toString());

                return true;
            }
        }

        return false;
    };

    /**
     * Obtain a PCB from storage
     * @param {String} pcbName The name of the PCB.
     * @return {Pcb} The PCB.
     */
    this.getPcb = (pcbName) => {
        const data = new Data();

        data.fromString(_webStorage.getPcb(pcbName));

        return Pcb.deserialize(data.getBuffer());
    };

    loadUserFromCookie();
}

User.ID_ANONYMOUS_USER = -1;
User.KEY_MISSION_PROGRESS = "progression";