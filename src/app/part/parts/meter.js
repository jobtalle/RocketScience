import {Scale} from "../../world/scale";
import {SpringApproach} from "../../utils/springApproach";

/**
 * A signal meter.
 * @param {Array} pins An array containing the pin indices.
 * @param {PartRenderer} renderer A part renderer to render state to.
 * @constructor
 */
export function Meter(pins, renderer) {
    let _spring = new SpringApproach(0, 0, 0, Math.PI);

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
        _spring.setTarget(state[pins[Meter.PIN_INPUT]] * Math.PI);
    };

    /**
     * Update the part.
     * @param {Number} timeStep The current time step.
     */
    this.update = timeStep => {
        _spring.update(timeStep);

        const dialTransform = renderer.getTransforms()[Meter.SPRITE_INDEX_DIAL];

        dialTransform.identity();
        dialTransform.translate(Scale.PIXELS_PER_POINT, 1);
        dialTransform.rotate(-_spring.getValue());
        dialTransform.translate(-Scale.PIXELS_PER_POINT, -Scale.PIXELS_PER_POINT * 0.5 - 1);
    };
}

Meter.SPRING_FORCE = 0.2;
Meter.SPRING_DAMPING = 0.7;
Meter.PIN_INPUT = 0;
Meter.SPRITE_INDEX_DIAL = 1;