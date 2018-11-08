import * as Myr from "../../lib/myr";

export const Pin = {
    TYPE_STRUCTURAL: "structural",
    TYPE_IN: "in",
    TYPE_OUT: "out",

    COLOR_IN: Myr.Color.fromHex("6699ff"),
    COLOR_OUT: Myr.Color.fromHex("33cc33"),
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
        else
            return Pin.COLOR_OUT;
    }
};