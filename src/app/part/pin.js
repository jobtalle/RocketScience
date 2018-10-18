import * as Myr from "../../lib/myr";

export const Pin = {
    TYPE_STRUCTURAL: "structural",
    TYPE_IN: "in",
    TYPE_OUT: "out",

    SIGNAL_CONTINUOUS: "continuous",
    SIGNAL_DISCRETE: "discrete",
    SIGNAL_BOTH: "both",

    COLOR_IN: Myr.Color.fromHex("6699ff"),
    COLOR_OUT_DISCRETE: Myr.Color.fromHex("33cc33"),
    COLOR_OUT_CONTINUOUS: Myr.Color.fromHex("cc66ff"),
    COLOR_POWER: Myr.Color.fromHex("ff0000"),

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
        else if (pin.type === Pin.TYPE_OUT) {
            if (pin.signal === Pin.SIGNAL_CONTINUOUS)
                return Pin.COLOR_OUT_CONTINUOUS;
            else
                return Pin.COLOR_OUT_DISCRETE;
        }
    }
};