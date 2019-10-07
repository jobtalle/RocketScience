/**
 * A tilt sensor.
 * @param {Object} context An object containing the game context, and references to some important utils.
 * @constructor
 */
function Tilt(context) {
    const DEFAULT = 0.5;
    const PIN_INDEX_OUTPUT = 0;
    const SPRITE_INDEX_SLIDER = 1;
    const SLIDER_EXTENSION = 3;

    let _body = null;
    let _tilt = DEFAULT;

    this.initialize = body => {
        _body = body;
    };

    this.tick = state => {
        state[context.pins[PIN_INDEX_OUTPUT]] = _tilt;
    };

    this.update = () => {
        _tilt = 0.5 - Math.sin(_body.getAngle()) * 0.5;

        const sliderTransform = context.renderer.getTransforms()[SPRITE_INDEX_SLIDER];

        sliderTransform.identity();
        sliderTransform.translate(context.refs.Scale.PIXELS_PER_POINT - SLIDER_EXTENSION + SLIDER_EXTENSION * 2 * _tilt, 0);
    };
}
