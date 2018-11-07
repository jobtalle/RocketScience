import {Scale} from "../../world/scale";

/**
 * A signal meter.
 * @param {Array} pins An array containing the pin indices.
 * @param {PartRenderer} renderer A part renderer to render state to.
 * @constructor
 */
export function Meter(pins, renderer) {
    let _targetAngle = 0;
    let _angle = _targetAngle;
    let _angleMomentum = 0;

    const updateAngle = () => {
        const delta = _targetAngle - _angle;

        _angleMomentum = _angleMomentum * Meter.SPRING_DAMPING + delta * Meter.SPRING_FORCE;

        _angle += _angleMomentum;

        if (_angle < 0)
            _angle = _angleMomentum = 0;
        else if (_angle > Math.PI) {
            _angle = Math.PI;
            _angleMomentum = 0;
        }
    };

    /**
     * Initialize the state.
     */
    this.initialize = () => {

    };

    /**
     * Update the state.
     * @param {Array} state A state array to read from and/or write to.
     */
    this.tick = state => {
        _targetAngle = state[pins[Meter.PIN_INPUT]] * Math.PI;
    };

    /**
     * Update the part.
     */
    this.update = () => {
        updateAngle();

        const dialTransform = renderer.getTransforms()[Meter.SPRITE_INDEX_DIAL];

        dialTransform.identity();
        dialTransform.translate(Scale.PIXELS_PER_POINT, 1);
        dialTransform.rotate(-_angle);
        dialTransform.translate(-Scale.PIXELS_PER_POINT, -Scale.PIXELS_PER_POINT * 0.5 - 1);
    };
}

Meter.SPRING_FORCE = 0.2;
Meter.SPRING_DAMPING = 0.7;
Meter.PIN_INPUT = 0;
Meter.SPRITE_INDEX_DIAL = 1;