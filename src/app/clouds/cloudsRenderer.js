import {Cloud} from "./cloud";

/**
 * A clouds renderer to render above a terrain.
 * @param {Myr} myr A Myriad instance.
 * @param {Number} density A cloud density factor in the range [0, 1].
 * @constructor
 */
export function CloudsRenderer(myr, density) {
    const _setFront = new CloudsRenderer.Set(myr, density);

    /**
     * Draw the back layer of the clouds.
     * @param {Number} y The Y coordinate for the cloud bases in pixels.
     * @param {Number} left The leftmost pixel to start drawing at.
     * @param {Number} right The rightmost pixel to start drawing at.
     */
    this.drawBack = (y, left, right) => {

    };

    /**
     * Draw the front layer of the clouds.
     * @param {Number} y The Y coordinate for the cloud bases in pixels.
     * @param {Number} left The leftmost pixel to start drawing at.
     * @param {Number} right The rightmost pixel to start drawing at.
     */
    this.drawFront = (y, left, right) => {
        _setFront.draw(y, left, right);
    };

    /**
     * Free all resources maintained by this cloud renderer.
     */
    this.free = () => {
        _setFront.free();
    };
}

CloudsRenderer.Set = function(myr, density) {
    const _bank = [];
    const _slots = new Array(CloudsRenderer.SLOTS).fill(-1);
    let _maxBase = 0;

    const populateSlots = () => {
        let lastCloud = -1;
        let first = -1;
        let second = -1;
        let last = -1;
        let count = 0;

        for (let i = 0; i < _slots.length; ++i) {
            if (Math.random() < density) {
                let index = lastCloud;

                while (index === lastCloud)
                    index = Math.floor(Math.random() * _bank.length);

                const base = _bank[index].getBase();

                if ((_slots.length - i) * CloudsRenderer.SLOT_SPACING < base)
                    continue;

                last = i;
                _slots[i] = lastCloud = index;
                ++count;

                if (first === -1)
                    first = last;
                else if (second === -1)
                    second = last;

                i += Math.ceil(base / CloudsRenderer.SLOT_SPACING);
                lastCloud = index;
            }
        }

        if (count > 2 && _slots[first] === _slots[last])
            while (_slots[first] === _slots[last] || _slots[first] === _slots[second])
                _slots[first] = Math.floor(Math.random() * _bank.length);
    };

    for (let i = 0; i < CloudsRenderer.BANK_SIZE; ++i) {
        const base = CloudsRenderer.CLOUD_BASE_MIN + Math.round((CloudsRenderer.CLOUD_BASE_MAX - CloudsRenderer.CLOUD_BASE_MIN) * Math.random());

        if (base > _maxBase)
            _maxBase = base;

        _bank.push(new Cloud(myr, base));
    }

    this.draw = (y, left, right) => {
        let r = 0;
        let i = Math.floor((left - _maxBase) / CloudsRenderer.SLOT_SPACING);
        let x = i * CloudsRenderer.SLOT_SPACING;

        while (i < 0)
            i += _slots.length;

        while (i >= _slots.length)
            i -= _slots.length;

        for (;x < right; ++i, x += CloudsRenderer.SLOT_SPACING) {
            if (i === _slots.length)
                i = 0;

            if (_slots[i] !== -1 && x + _bank[_slots[i]].getBase() > left)
                ++r, _bank[_slots[i]].draw(x, y);
        }
    };

    this.free = () => {
        for (const cloud of _bank)
            cloud.free();
    };

    populateSlots();
};

CloudsRenderer.BANK_SIZE = 8;
CloudsRenderer.SLOT_SPACING = 100;
CloudsRenderer.SLOTS = 100;
CloudsRenderer.CLOUD_BASE_MIN = 80;
CloudsRenderer.CLOUD_BASE_MAX = 400;