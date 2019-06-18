import {Budget} from "./budget";
import {getPartFromId, getPartId} from "../../part/objects";

/**
 * A part budget to limit the number of parts used.
 * @param {Array} entries An array of BudgetInventory.Entry objects.
 * @constructor
 */
export function BudgetInventory(entries) {
    let _entries = {};
    let _isEdited = false;

    const build = () => {
        _entries = {};

        for (const entry of entries)
            _entries[entry.name] = entry.count;
    };

    /**
     * Get the budget type.
     * @returns {Object} The type constant.
     */
    this.getType = () => Budget.TYPE_INVENTORY;

    /**
     * Get the budget of a part.
     * @param {String} name The part name.
     * @returns {Number} The maximum number of instances for this part, or null if this was not specified.
     */
    this.getCount = name => {
        const budget = _entries[name];

        if (budget === undefined)
            return null;

        return budget;
    };

    /**
     * Change the budget of a part.
     * @param {String} name The part name.
     * @param {Number} count The maximum number of instances for this part. If zero, getCount for this part returns null.
     */
    this.setCount = (name, count) => {
        if (count === 0) {
            for (let i = entries.length; i-- > 0;) if (entries[i].name === name) {
                entries.splice(i, 1);

                break;
            }
        }
        else {
            if (!_entries[name])
                entries.push(new BudgetInventory.Entry(name, count));
            else {
                for (const entry of entries) if (entry.name === name)
                    entry.count = count;
            }
        }

        build();

        _isEdited = true;
    };

    /**
     * Checks if the budget has been edited.
     * @returns {Boolean} A boolean indicating whether the budget has been edited.
     */
    this.isEdited = () => {
        return _isEdited;
    };

    /**
     * Returns a deep copy of this budget.
     * @returns {BudgetInventory} a new BudgetInventory.
     */
    this.copy = () => {
        const newEntries = [];

        for (const entry of entries)
            newEntries.push(entry.copy());

        return new BudgetInventory(newEntries);
    };

    /**
     * Serialize this inventory.
     * @param {Object} buffer A byte buffer to serialize to.
     */
    this.serialize = buffer => {
        buffer.writeByte(entries.length);

        for (const entry of entries) {
            buffer.writeByte(getPartId(entry.name));
            buffer.writeShortSigned(entry.count);
        }
    };

    build();
}

BudgetInventory.deserialize = buffer => {
    let entries = [];
    let entryLength = buffer.readByte();

    for (let idx = 0; idx < entryLength; ++idx) {
        entries.push(new BudgetInventory.Entry(getPartFromId(buffer.readByte()).object, buffer.readShortSigned()));
    }

    return new BudgetInventory(entries);
};

BudgetInventory.COUNT_INFINITE = -1;

/**
 * An inventory entry.
 * @param {String} name The name of the part.
 * @param {Number} count The number of parts of this type.
 * @constructor
 */
BudgetInventory.Entry = function(name, count) {
    this.name = name;
    this.count = count;

    /**
     * Returns a copy of this entry.
     * @returns {BudgetInventory.Entry} a new Entry.
     */
    this.copy = () => {
        return new BudgetInventory.Entry(name, count);
    };
};