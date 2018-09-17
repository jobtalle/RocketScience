import * as Myr from "../../lib/myr";

export const Pin = {
    TYPE_STRUCTURAL: "structural",
    TYPE_IN: "in",
    TYPE_OUT: "out",

    SIGNAL_CONTINUOUS: "continuous",
    SIGNAL_DISCRETE: "discrete",

    COLOR_IN: Myr.Color.fromHex("6699ff"),
    COLOR_OUT: Myr.Color.fromHex("33cc33"),
    COLOR_POWER: Myr.Color.fromHex("ff0000"),

    /**
     * Get the color code assigned to a pin.
     * @param {Object} pin A valid pin object.
     */
    getPinColor: function(pin) {
        if (pin.type === Pin.TYPE_IN) {
            if (pin.name.includes("POWER"))
                return Pin.COLOR_POWER;

            return Pin.COLOR_IN;
        }
        else if (pin.type === Pin.TYPE_OUT) {
            return Pin.COLOR_OUT;
        }
    }
};