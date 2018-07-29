import {PartConfiguration} from "./configuration/configuration";
import {Footprint} from "./configuration/footprint";
import {PinLayout} from "./configuration/pinLayout";
import {PartSprites} from "./configuration/partSprites";

export function Led() {

}

Led.CONFIGURATIONS = [
    new PartConfiguration(
        new Footprint(),
        new PinLayout(),
        new PartSprites()
    )
];