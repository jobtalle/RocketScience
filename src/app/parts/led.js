import {PartConfiguration} from "./configuration/configuration";
import {Footprint} from "./configuration/footprint";
import {PinLayout} from "./configuration/pinLayout";
import {PartSprites} from "./configuration/partSprites";
import * as Myr from "../../lib/myr";

export function Led() {

}

Led.CONFIGURATIONS = [
    new PartConfiguration(
        new Footprint(
            [
                new Myr.Vector(0, 0),
                new Myr.Vector(0, 1)
            ],
            [

            ]),
        new PinLayout(),
        new PartSprites(
            [
                new PartSprites.Sprite(new Myr.Vector(0, 0), "partLed")
            ]
        )
    )
];