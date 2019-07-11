import {ScatterProfile} from "./scatters/scatterProfile";

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
    ])
]};

Profiles.ID_FIELDS = 0;
Profiles.ID_MOUNTAINS = 1;