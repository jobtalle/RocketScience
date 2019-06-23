import {Objective} from "./objective";
import {Editable} from "./editable/editable";
import {PhysicsConfiguration} from "../world/physics/physicsConfiguration";

/**
 * A mission consists of one or multiple objectives.
 * @param {Array} objectives All objectives required to complete this mission.
 * @param {Array} editables An array of editables. The first editable will be the default pcb.
 * @param {PhysicsConfiguration} physicsConfiguration The physics configuration.
 * @param {String} title A title for this mission.
 * @param {String} description A description of this mission.
 * @constructor
 */
export function Mission(objectives, editables, physicsConfiguration, title, description) {
    let _checking = null;
    let _finished = null;
    let _checkMarks = null;
    let _onChange = null;
    let _isCompleted = false; // Should never be (de)serialized!
    let _isEdited = false;

    const rewind = () => {
        _checking = objectives.slice();
        _finished = [];
        _checkMarks = new Array(objectives.length).fill(false);

        if (_onChange)
            _onChange(_checkMarks);
    };

    /**
     * Set the function that should be executed when a change in passed objectives occurs.
     * The function will get one parameter which is a boolean array mapping on the objectives of this mission.
     * @param {Function} onChange A function to call when a change in passed objectives occurs.
     */
    this.setOnChange = onChange => _onChange = onChange;

    /**
     * Get the physics configuration.
     * @returns {PhysicsConfiguration} The physics configuration.
     */
    this.getPhysicsConfiguration = () => physicsConfiguration;

    /**
     * Get this missions title.
     * @returns {String} The mission title.
     */
    this.getTitle = () => title;

    /**
     * Set the mission title.
     * @param {String} newTitle A title.
     */
    this.setTitle = newTitle => {
        title = newTitle;
        _isEdited = true;
    };

    /**
     * Get this missions description.
     * @returns {String} The mission description.
     */
    this.getDescription = () => description;

    /**
     * Set the mission description.
     * @param {String} newDescription A description.
     */
    this.setDescription = newDescription => {
        description = newDescription;
        _isEdited = true;
    };

    /**
     * Prime this mission for operation.
     * @param {Array} objects An array containing all editable PCB's as game objects in order.
     */
    this.prime = objects => {
        rewind();

        for (const objective of objectives)
            objective.prime(objects);
    };

    /**
     * Check all unfinished objectives.
     * @returns {Boolean} A boolean indicating whether all objectives have been completed.
     */
    this.validate = () => {
        let _changed = false;

        for (let i = _checking.length; i-- > 0;) if (_checking[i].validate()) {
            _finished.push(_checking[i]);
            _checkMarks[objectives.indexOf(_checking[i])] = _changed = true;
            _checking.splice(i, 1);
        }

        if (_changed && _onChange)
            _onChange(_checkMarks);

        _isCompleted = _checking.length === 0;

        return _isCompleted;
    };

    /**
     * Check if the most recent call of validate was true or false. This function does not validate in any way.
     * @return {Boolean} True if the mission has been completed, false otherwise
     */
    this.isCompleted = () => {
        return _isCompleted;
    };

    /**
     * Get the objectives of this mission.
     * @returns {Array} An array of objectives.
     */
    this.getObjectives = () => objectives;

    /**
     * Add an objective to the mission.
     * @param {Objective} objective A new objective.
     */
    this.addObjective = objective => {
        objectives.push(objective);
        _isEdited = true;
    };

    /**
     * Remove an objective from the mission.
     * @param {Objective} objective The objective that will be removed.
     */
    this.removeObjective = objective => {
        objectives.splice(objectives.indexOf(objective), 1);
        _isEdited = true;
    };

    /**
     * Get the editables of this mission.
     * @returns {Array} An array of editables.
     */
    this.getEditables = () => editables;

    /**
     * Add an editable to the mission.
     * @param {Editable} editable The editable to add.
     */
    this.addEditable = editable => {
        editables.push(editable);
        _isEdited = true;
    };

    /**
     * Remove an editable from the mission.
     * @param {Editable} editable The editable to remove.
     */
    this.removeEditable = editable => {
        editables.splice(editables.indexOf(editable), 1);
        _isEdited = true;
    };

    /**
     * Check whether this mission is finished.
     * @returns {Boolean} A boolean indicating whether this mission has finished.
     */
    this.isFinished = () => {
        for (const checkMark of _checkMarks) if (!checkMark)
            return false;

        return true;
    };

    /**
     * Check whether the mission information has been edited (mission editor only).
     * @returns {Boolean} A boolean indicating whether this mission has been edited.
     */
    this.isEdited = () => {
        for (const editable of editables)
            if (editable.isEdited())
                return true;

        for (const objective of objectives)
            if (objective.isEdited())
                return true;

        return _isEdited || physicsConfiguration.isEdited();
    };

    /**
     * Serialize this mission.
     * @param {ByteBuffer} buffer A byte buffer.
     */
    this.serialize = buffer => {
        buffer.writeByte(objectives.length);

        for (const objective of objectives)
            objective.serialize(buffer);

        buffer.writeByte(editables.length);

        for (const editable of editables)
            editable.serialize(buffer);

        physicsConfiguration.serialize(buffer);

        buffer.writeString(title);
        buffer.writeString(description);
    };

    rewind();
}

/**
 * Deserialize a mission.
 * @param {ByteBuffer} buffer A byte buffer.
 * @returns {Mission} The deserialized mission.
 */
Mission.deserialize = buffer => {
    const objectives = [];
    const objectivesLength = buffer.readByte();

    for (let idx = 0; idx < objectivesLength; ++idx)
        objectives.push(Objective.deserialize(buffer));

    const editables = [];
    const editablesLength = buffer.readByte();

    for (let idx = 0; idx < editablesLength; ++idx)
        editables.push(Editable.deserialize(buffer));

    const physicsConfiguration = PhysicsConfiguration.deserialize(buffer);
    const title = buffer.readString();
    const description = buffer.readString();

    return new Mission(
        objectives,
        editables,
        physicsConfiguration,
        title,
        description);
};