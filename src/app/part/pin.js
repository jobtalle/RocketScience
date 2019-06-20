import {StyleUtils} from "../utils/styleUtils";

export const Pin = {
    TYPE_STRUCTURAL: "structural",
    TYPE_IN: "in",
    TYPE_OUT: "out",

    COLOR_IN: StyleUtils.getColorHex("--game-color-pcb-pin-in"),
    COLOR_OUT: StyleUtils.getColorHex("--game-color-pcb-pin-out"),
    COLOR_POWER: StyleUtils.getColorHex("--game-color-pcb-pin-power"),

    NAME_POWER: "PIN_POWER_NAME",

    /**
     * Get the color code assigned to a pin.
     * @param {Object} pin A valid pin object.
     */
    getPinColor: function(pin) {
        if (pin.name.includes(Pin.NAME_POWER))
            return Pin.COLOR_POWER;

        if (pin.type === Pin.TYPE_IN)
            return Pin.COLOR_IN;
        else
            return Pin.COLOR_OUT;
    }
};