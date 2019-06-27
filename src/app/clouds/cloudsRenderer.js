import {Cloud} from "./cloud";

/**
 * A clouds renderer to render above a terrain.
 * @param {Myr} myr A Myriad instance.
 * @param {Number} altitude An altitude in meters at which clouds start.
 * @constructor
 */
export function CloudsRenderer(myr, altitude) {
    const _cloudBank = [];

    const makeClouds = () => {
        for (let i = 0; i < CloudsRenderer.BANK_SIZE; ++i)
            _cloudBank.push(new Cloud(
                myr,
                CloudsRenderer.CLOUD_BASE_MIN + Math.round((CloudsRenderer.CLOUD_BASE_MAX - CloudsRenderer.CLOUD_BASE_MIN) * Math.random())));
    };

    /**
     * Draw the back layer of the clouds.
     */
    this.drawBack = () => {

    };

    /**
     * Draw the front layer of the clouds.
     */
    this.drawFront = () => {
        let x = 0;

        for (const cloud of _cloudBank) {
            cloud.draw(x, 0);

            x += CloudsRenderer.CLOUD_BASE_MAX;
        }
    };

    /**
     * Free all resources maintained by this cloud renderer.
     */
    this.free = () => {
        for (const cloud of _cloudBank)
            cloud.free();
    };

    makeClouds();
}

CloudsRenderer.BANK_SIZE = 8;
CloudsRenderer.CLOUD_BASE_MIN = 80;
CloudsRenderer.CLOUD_BASE_MAX = 400;