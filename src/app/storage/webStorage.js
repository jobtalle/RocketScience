/**
 * Storage for larger files up to 5MB in total size.
 * @constructor
 */
export function WebStorage() {
    const setItem = (key, value) => {
        localStorage.setItem(key, value);
    };

    const getItem = (key) => {
        return localStorage.getItem(key);
    };

    const removeItem = (key) => {
        localStorage.removeItem(key);
    };

    const getAllKeys = () => {
        return Object.keys(localStorage);
    };

    /**
     * Remove the mission progress from the storage.
     * @param {String} missionName The name of the mission.
     */
    this.clearMissionProgress = (missionName) => {
        removeItem(WebStorage.PREFIX_MISSION_PROGRESS + missionName);
    };

    /**
     * Store the mission progress in the storage.
     * @param {String} missionName The name of the mission.
     * @param {String} data The data that has to be stored.
     */
    this.saveMissionProgress = (missionName, data) => {
        setItem(WebStorage.PREFIX_MISSION_PROGRESS + missionName, data);
    };

    /**
     * Obtain the mission progress from the storage.
     * @param {String} missionName The name of the mission.
     * @return {String} The mission data.
     */
    this.getMissionProgress = (missionName) => {
        return getItem(WebStorage.PREFIX_MISSION_PROGRESS + missionName);
    };

    /**
     * Remove the custom mission.
     * @param {String} missionName The name of the mission.
     */
    this.removeCustomMission = (missionName) => {
        removeItem(WebStorage.PREFIX_CUSTOM_MISSION + missionName);
    };

    /**
     * Save the custom mission to the storage.
     * @param {String} missionName The name of the mission.
     * @param {String} data The mission data.
     */
    this.saveCustomMission = (missionName, data) => {
        setItem(WebStorage.PREFIX_CUSTOM_MISSION + missionName, data);
    };

    /**
     * Obtain the custom mission.
     * @param {String} missionName The name of the mission.
     */
    this.getCustomMission = (missionName) => {
        getItem(WebStorage.PREFIX_CUSTOM_MISSION + missionName);
    };

    /**
     * Obtain all the custom missions.
     * @param {Function} onLoad Function that is called for each loaded custom mission.
     */
    this.getAllCustomMissions = (onLoad) => {
        for (const key in getAllKeys()) {
            if (key.startsWith(WebStorage.PREFIX_CUSTOM_MISSION))
                onLoad(getItem(key));
        }
    };

    /**
     * Remove the PCB from storage.
     * @param {String} pcbName The name of the PCB.
     */
    this.removePcb = (pcbName) => {
        removeItem(WebStorage.PREFIX_PCB + pcbName);
    };

    /**
     * Store the PCB to storage.
     * @param {String} pcbName The name of the PCB
     * @param {String} data The data of the PCB.
     */
    this.savePcb = (pcbName, data) => {
        setItem(WebStorage.PREFIX_PCB + pcbName, data);
    };

    /**
     * Obtain the PCB data.
     * @param {String} pcbName The PCB name.
     * @return {String} The PCB data.
     */
    this.getPcb = (pcbName) => {
        getItem(WebStorage.PREFIX_PCB + pcbName);
    };

    /**
     * Obtain all PCBs from storage.
     * @param {Function} onLoad Function that is called for each loaded PCB.
     */
    this.getAllPcbs = (onLoad) => {
        for (const key in getAllKeys()) {
            if (key.startsWith(WebStorage.PREFIX_PCB))
                onLoad(getItem(key));
        }
    };

    /**
     * Remove the subPCB from storage.
     * @param {String} pcbName The name of the subPCB
     */
    this.removeSubPcb = (pcbName) => {
        removeItem(WebStorage.PREFIX_SUB_PCB + pcbName);
    };

    /**
     * Store the subPCB to storage.
     * @param {String} pcbName The name of the subPCB.
     * @param {String} data The data of the subPCB.
     */
    this.saveSubPcb = (pcbName, data) => {
        setItem(WebStorage.PREFIX_SUB_PCB + pcbName, data);
    };

    /**
     * Obtain the subPCB.
     * @param {String} pcbName The name of the subPCB.
     * @return {String} The subPCB data.
     */
    this.getSubPcb = (pcbName) => {
        return getItem(WebStorage.PREFIX_SUB_PCB + pcbName);
    };

    /**
     * Obtain all subPCBs from storage.
     * @param {Function} onLoad Function that is called for each loaded subPCB.
     */
    this.getAllSubPcbs = (onLoad) => {
        for (const key in getAllKeys()) {
            if (key.startsWith(WebStorage.PREFIX_SUB_PCB))
                onLoad(getItem(key));
        }
    };

    /**
     * Removes completion progress from the mission.
     * @param {String} missionName The name of the mission.
     */
    this.setMissionIncomplete = (missionName) => {
        removeItem(WebStorage.PREFIX_COMPLETED_MISSION + missionName);
    };

    /**
     * Marks the mission as completed.
     * @param {String} missionName The name of the mission.
     */
    this.setMissionCompleted = (missionName) => {
        setItem(WebStorage.PREFIX_COMPLETED_MISSION + missionName, true);
    };

    /**
     * Returns whether the mission is completed or not.
     * @param {String} missionName The name of the mission.
     * @return {Boolean} True if the mission is completed, false otherwise.
     */
    this.isMissionCompleted = (missionName) => {
        const complete = getItem(WebStorage.PREFIX_COMPLETED_MISSION + missionName);

        return !(complete === null || complete === undefined || complete === "false");
    }
}

WebStorage.PREFIX_COMPLETED_MISSION = "completed-mission-";
WebStorage.PREFIX_MISSION_PROGRESS = "mission-progress-";
WebStorage.PREFIX_CUSTOM_MISSION = "custom-mission-";
WebStorage.PREFIX_PCB = "PCB-";
WebStorage.PREFIX_SUB_PCB = "SUB-PCB";
