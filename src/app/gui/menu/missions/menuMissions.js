import {Mission} from "../../../mission/mission";
import {Objective} from "../../../mission/objective";
import {GoalPinState} from "../../../mission/goal/goalPinState";
import {Led} from "../../../part/parts/led";
import {Switch} from "../../../part/parts/switch";
import {GateXor} from "../../../part/parts/gateXor";
import {Editable} from "../../../mission/editable/editable";
import {EditableRegion} from "../../../mission/editable/editableRegion";
import {BudgetInventory} from "../../../mission/budget/budgetInventory";
import {Pcb} from "../../../pcb/pcb";
import {MenuMission} from "./mission/menuMission";
import {PhysicsConfiguration} from "../../../world/physics/physicsConfiguration";
import Myr from "myr.js"
import {Data} from "../../../file/data";
import {Menu} from "../menu";

/**
 * A selection of missions that can be started.
 * @param {Menu} menu A menu.
 * @constructor
 */
export function MenuMissions(menu) {
    const _element = document.createElement("div");

    const make = () => {
        _element.className = MenuMissions.CLASS;

        for (const mission of MenuMissions.MISSIONS)
            _element.appendChild(new MenuMission(menu, mission).getElement());

        const data = new Data();
        MenuMissions.MISSIONS[1].serialize(data.getBuffer());

        const string = data.toString();

        // const blob = data.getBlob();
        // const fileName = "led.blob";
        //
        // if (navigator.msSaveBlob) { // IE 10+
        //     navigator.msSaveBlob(blob, fileName);
        // } else {
        //     const link = document.createElement("a");
        //
        //     if (link.download !== undefined) {
        //         let url = URL.createObjectURL(blob);
        //
        //         link.setAttribute("href", url);
        //         link.setAttribute("download", fileName);
        //         link.style.visibility = "hidden";
        //
        //         document.body.appendChild(link);
        //
        //         link.click();
        //     }
        // }

        

        const data2 = new Data();
        data2.fromString(string);

        const mission = Mission.deserialize(data2.getBuffer());

        _element.appendChild(new MenuMission(menu, mission).getElement());
    };

    /**
     * Get the HTML element of this menu.
     * @returns {HTMLElement}
     */
    this.getElement = () => _element;

    make();
}

MenuMissions.CLASS = "missions";

// TODO: Load missions from external source
const defaultPcb = new Pcb();
defaultPcb.initialize();

MenuMissions.MISSIONS = [
    new Mission([
            new Objective([new GoalPinState("Switch", Switch.PIN_INDEX_OUT, 1)], "Flip a powered switch"),
            new Objective([new GoalPinState("Led", Led.PIN_INDEX_POWER, 1)], "Light up a LED")
        ],
        [
            new Editable(
                new EditableRegion(
                    new Myr.Vector(50, -5),
                    new Myr.Vector(5, 5)),
                defaultPcb,
                new Myr.Vector(1, 1),
                null),
            new Editable(
                new EditableRegion(
                    new Myr.Vector(60, -5),
                    new Myr.Vector(5, 5)),
                defaultPcb.copy(),
                new Myr.Vector(1, 1),
                new BudgetInventory([
                    new BudgetInventory.Entry("Wheel", 2),
                    new BudgetInventory.Entry("Propeller", 2),
                    new BudgetInventory.Entry("Led", 4),
                    new BudgetInventory.Entry("Battery", 1),
                    new BudgetInventory.Entry("Switch", 1),
                    new BudgetInventory.Entry("Button", 1),
                    new BudgetInventory.Entry("GateOr", BudgetInventory.COUNT_INFINITE),
                    new BudgetInventory.Entry("Controller", 1)
                ]))
        ],
        new PhysicsConfiguration(1),
        "Hello LED",
        "Light up a LED using a physical switch."),
    new Mission([
            new Objective([new GoalPinState("GateXor", GateXor.PIN_INDEX_POWER, 1)], "Mystery objective! \u30B7")
        ],
        [
            new Editable(
                new EditableRegion(
                    new Myr.Vector(50.2465, -5.7),
                    new Myr.Vector(5, 5)),
                defaultPcb.copy(),
                new Myr.Vector(0.2, 1),
                null),
            new Editable(
                new EditableRegion(
                    new Myr.Vector(60, -5),
                    new Myr.Vector(5, 5)),
                defaultPcb.copy(),
                new Myr.Vector(1, 1),
                new BudgetInventory([
                    new BudgetInventory.Entry("Wheel", 2),
                    new BudgetInventory.Entry("Propeller", 2),
                    new BudgetInventory.Entry("Led", 4),
                    new BudgetInventory.Entry("Battery", 1),
                    new BudgetInventory.Entry("Switch", 1),
                    new BudgetInventory.Entry("Button", 1),
                    new BudgetInventory.Entry("GateOr", BudgetInventory.COUNT_INFINITE),
                    new BudgetInventory.Entry("Controller", 1)
                ]))
        ],
        new PhysicsConfiguration(0),
        "SPACE",
        "Free play without gravity")
];