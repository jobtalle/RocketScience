import {ScatterProfile} from "./scatters/scatterProfile";
import {FillSmooth} from "./fills/fillSmooth";
import {StyleUtils} from "../utils/styleUtils";

/**
 * Themed graphics scatters.
 */
export const Profiles = {
    scatters: [
        // Fields
        new ScatterProfile([
            new ScatterProfile.Entry(ScatterProfile.TYPE_ROCKS, 0.4, 0.5, 0.4)
        ]),
        // Mountains
        new ScatterProfile([
            new ScatterProfile.Entry(ScatterProfile.TYPE_ROCKS, 0.3, 0.7, 1.2)
        ])],
    fills: [
        // Fields
        new FillSmooth(
            StyleUtils.getColor("--game-color-terrain-fields-border"),
            StyleUtils.getColor("--game-color-terrain-fields-fill"),
            [
                new FillSmooth.Entry(StyleUtils.getColor("--game-color-terrain-fields-shade"), 8)
            ]),
        // Mountains
        new FillSmooth(
            StyleUtils.getColor("--game-color-terrain-fields-border"),
            StyleUtils.getColor("--game-color-terrain-fields-fill"),
            [
                new FillSmooth.Entry(StyleUtils.getColor("--game-color-terrain-fields-shade"), 32)
            ])
    ]
};

Profiles.ID_FIELDS = 0;
Profiles.ID_MOUNTAINS = 1;