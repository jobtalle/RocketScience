import {Scale} from "../../world/scale";

/**
 * A signal meter.
 * @param {Array} pins An array containing the pin indices.
 * @param {PartRenderer} renderer A part renderer to render state to.
 * @constructor
 */
export function Meter(pins, renderer) {
    let _targetAngle = Math.PI;
    let _angle = _targetAngle;

    this.initialize = () => {

    };

    this.tick = state => {
        _targetAngle = Math.PI - state[pins[Meter.PIN_INPUT]] * Math.PI;
    };

    this.update = timeStep => {
        _angle += (_targetAngle - _angle) * timeStep * 6;

        const dialTransform = renderer.getTransforms()[Meter.SPRITE_INDEX_DIAL];

        dialTransform.identity();
        dialTransform.translate(Scale.PIXELS_PER_POINT, 1);
        dialTransform.rotate(_angle);
        dialTransform.translate(-1, -1);
    };
}

Meter.PIN_INPUT = 0;
Meter.SPRITE_INDEX_DIAL = 1;