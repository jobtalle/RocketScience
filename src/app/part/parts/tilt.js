import {Scale} from "../../world/scale";

export function Tilt(pins, renderer) {
    let _body = null;
    let _tilt = Tilt.DEFAULT;

    this.initialize = body => {
        _body = body;
    };

    this.tick = state => {
        if (state[pins[Tilt.PIN_INDEX_POWER]] === 1)
            state[pins[Tilt.PIN_INDEX_OUTPUT]] = _tilt;
        else
            state[pins[Tilt.PIN_INDEX_OUTPUT]] = Tilt.DEFAULT;
    };

    this.update = () => {
        _tilt = 0.5 - Math.sin(_body.getAngle()) * 0.5;

        const sliderTransform = renderer.getTransforms()[Tilt.SPRITE_INDEX_SLIDER];

        sliderTransform.identity();
        sliderTransform.translate(Scale.PIXELS_PER_POINT - Tilt.SLIDER_EXTENSION + Tilt.SLIDER_EXTENSION * 2 * _tilt, 0);
    };
}

Tilt.DEFAULT = 0.5;
Tilt.PIN_INDEX_POWER = 0;
Tilt.PIN_INDEX_OUTPUT = 1;
Tilt.SPRITE_INDEX_SLIDER = 1;
Tilt.SLIDER_EXTENSION = 3;