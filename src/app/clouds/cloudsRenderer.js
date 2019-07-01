import {Cloud} from "./cloud";

/**
 * A clouds renderer to render above a terrain.
 * @param {Myr} myr A Myriad instance.
 * @param {Number} altitude An altitude in meters at which clouds start.
 * @constructor
 */
export function CloudsRenderer(myr, altitude) {
    const _setFront = new CloudsRenderer.Set(myr);

    /**
     * Draw the back layer of the clouds.
     */
    this.drawBack = () => {

    };

    /**
     * Draw the front layer of the clouds.
     */
    this.drawFront = () => {

    };

    /**
     * Free all resources maintained by this cloud renderer.
     */
    this.free = () => {
        _setFront.free();
    };
}

CloudsRenderer.Set = function(myr) {
    const _bank = [];
    const _slots = new Array(CloudsRenderer.SLOTS).fill(-1);
    let _shift = 0;

    for (let i = 0; i < CloudsRenderer.BANK_SIZE; ++i)
        _bank.push(new Cloud(
            myr,
            CloudsRenderer.CLOUD_BASE_MIN + Math.round((CloudsRenderer.CLOUD_BASE_MAX - CloudsRenderer.CLOUD_BASE_MIN) * Math.random())));

    {
        let xp = -1;
        let lastCloud = -1;

        for (let i = 0; i < _slots.length; ++i) {
            const x = i * CloudsRenderer.SLOT_SPACING;
            const possibleCloud = Math.floor(Math.random() * _bank.length);

            if (possibleCloud === lastCloud) {
                --i;

                continue;
            }

            if (xp === -1 || x - _bank[possibleCloud].getBase() * 0.5 > xp)
                _slots[i] = lastCloud = possibleCloud;
        }
    }

    this.draw = (left, right) => {

    };

    this.free = () => {
        for (const cloud of _bank)
            cloud.free();
    };
};

CloudsRenderer.BANK_SIZE = 8;
CloudsRenderer.SLOT_SPACING = 100;
CloudsRenderer.SLOTS = 100;
CloudsRenderer.CLOUD_BASE_MIN = 80;
CloudsRenderer.CLOUD_BASE_MAX = 400;