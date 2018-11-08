import {SpringApproach} from "../../utils/springApproach";
import {Scale} from "../../world/scale";

export function Altimeter(pins, renderer) {
    let _spring = new SpringApproach(0, 0, 0, Math.PI);
    let _body = null;

    this.initialize = body => {
        _body = body;
    };

    this.tick = state => {
        if (state[pins[Altimeter.PIN_INDEX_POWER]] === 1) {
            const value = Math.max(0, Math.min(1, -_body.getPosition().y / Altimeter.MAX_ALTITUDE));

            state[pins[Altimeter.PIN_INDEX_OUTPUT]] = value;

            _spring.setTarget(value * Math.PI);
        }
        else {
            state[pins[Altimeter.PIN_INDEX_OUTPUT]] = 0;

            _spring.setTarget(0);
        }
    };

    this.update = timeStep => {
        _spring.update(timeStep);

        const dialTransform = renderer.getTransforms()[Altimeter.SPRITE_INDEX_DIAL];

        dialTransform.identity();
        dialTransform.translate(Scale.PIXELS_PER_POINT, 1);
        dialTransform.rotate(-_spring.getValue());
        dialTransform.translate(-Scale.PIXELS_PER_POINT, -Scale.PIXELS_PER_POINT * 0.5 - 1);
    };
}

Altimeter.SPRITE_INDEX_DIAL = 1;
Altimeter.MAX_ALTITUDE = 30;
Altimeter.PIN_INDEX_POWER = 0;
Altimeter.PIN_INDEX_OUTPUT = 1;