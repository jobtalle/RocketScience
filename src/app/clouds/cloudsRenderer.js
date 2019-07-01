import {Cloud} from "./cloud";

/**
 * A clouds renderer to render above a terrain.
 * @param {Myr} myr A Myriad instance.
 * @param {Number} height  The y coordinate to draw the clouds at.
 * @param {Number} density A cloud density factor in the range [0, 1].
 * @constructor
 */
export function CloudsRenderer(myr, height, density) {
    const _setBack = new CloudsRenderer.Set(myr, density, CloudsRenderer.SCALE_BACK);
    const _setFront = new CloudsRenderer.Set(myr, density, CloudsRenderer.SCALE_FRONT);

    /**
     * Shift the clouds.
     * @param {Number} delta The amount of shift in pixels.
     */
    this.shift = delta => {
        _setBack.shift(delta * (1 - CloudsRenderer.SHIFT_BACK));
        _setFront.shift(delta * (1 - CloudsRenderer.SHIFT_FRONT));
    };

    /**
     * Draw the back layer of the clouds.
     * @param {Number} left The leftmost pixel to start drawing at.
     * @param {Number} right The rightmost pixel to stop drawing at.
     * @param {Number} top The topmost pixel to start drawing at.
     * @param {Number} bottom The bottommost pixel to stop drawing at.
     */
    this.drawBack = (left, right, top, bottom) => {
        const y = height + ((top + bottom) * 0.5 - height) * CloudsRenderer.SHIFT_BACK * CloudsRenderer.SHIFT_VERTICAL_MULTIPLIER;

        if (y < top)
            return;

        _setBack.draw(
            y,
            left,
            right,
            (left + right) * 0.5 * CloudsRenderer.SHIFT_BACK);
    };

    /**
     * Draw the front layer of the clouds.
     * @param {Number} left The leftmost pixel to start drawing at.
     * @param {Number} right The rightmost pixel to stop drawing at.
     * @param {Number} top The topmost pixel to start drawing at.
     * @param {Number} bottom The bottommost pixel to stop drawing at.
     */
    this.drawFront = (left, right, top, bottom) => {
        const y = height + ((top + bottom) * 0.5 - height) * CloudsRenderer.SHIFT_FRONT * CloudsRenderer.SHIFT_VERTICAL_MULTIPLIER;

        if (y < top)
            return;

        _setFront.draw(
            y,
            left,
            right,
            (left + right) * 0.5 * CloudsRenderer.SHIFT_FRONT);
    };

    /**
     * Free all resources maintained by this cloud renderer.
     */
    this.free = () => {
        _setFront.free();
    };
}

CloudsRenderer.Set = function(myr, density, scale) {
    const _bank = [];
    const _slots = new Array(CloudsRenderer.SLOTS).fill(-1);
    let _maxBase = 0;
    let _shift = 0;

    const populateSlots = () => {
        let lastCloud = -1;
        let first = -1;
        let second = -1;
        let last = -1;
        let count = 0;

        for (let i = 0; i < _slots.length; ++i) {
            if (density < Math.random()) {
                i += Math.round((CloudsRenderer.CLOUD_BASE_MIN + (CloudsRenderer.CLOUD_BASE_MAX - CloudsRenderer.CLOUD_BASE_MIN) * 0.5) / CloudsRenderer.SLOT_SPACING);

                continue;
            }

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

        if (count > 2 && _slots[first] === _slots[last])
            while (_slots[first] === _slots[last] || _slots[first] === _slots[second])
                _slots[first] = Math.floor(Math.random() * _bank.length);
    };

    for (let i = 0; i < CloudsRenderer.BANK_SIZE; ++i) {
        const base = (CloudsRenderer.CLOUD_BASE_MIN + Math.round((CloudsRenderer.CLOUD_BASE_MAX - CloudsRenderer.CLOUD_BASE_MIN) * Math.random())) * scale;
        const cloud = new Cloud(myr, base * scale, scale);

        if (cloud.getBase() > _maxBase)
            _maxBase = cloud.getBase();

        _bank.push(cloud);
    }

    this.shift = delta => {
        _shift += delta;

        if (_shift > CloudsRenderer.STRIDE)
            _shift -= CloudsRenderer.STRIDE;
        else if (_shift < -CloudsRenderer.STRIDE)
            _shift += CloudsRenderer.STRIDE;
    };

    this.draw = (y, left, right, shift) => {
        let r = 0;
        let i = Math.floor((left - _maxBase - shift - _shift) / CloudsRenderer.SLOT_SPACING);
        let x = i * CloudsRenderer.SLOT_SPACING + shift + _shift;

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
CloudsRenderer.SLOT_SPACING = 64;
CloudsRenderer.SLOTS = 100;
CloudsRenderer.CLOUD_BASE_MIN = 100;
CloudsRenderer.CLOUD_BASE_MAX = 600;
CloudsRenderer.SHIFT_FRONT = -0.1;
CloudsRenderer.SHIFT_BACK = 0.1;
CloudsRenderer.SHIFT_VERTICAL_MULTIPLIER = 0.2;
CloudsRenderer.SCALE_FRONT = 1;
CloudsRenderer.SCALE_BACK = 1.5;
CloudsRenderer.STRIDE = CloudsRenderer.SLOTS * CloudsRenderer.SLOT_SPACING;