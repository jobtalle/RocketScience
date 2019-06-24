function Altimeter(context) {
    let _spring = new context.refs.SpringApproach(0, 0, 0, Math.PI);
    let _body = null;

    const SPRITE_INDEX_DIAL = 1;
    const MAX_ALTITUDE = 30;
    const PIN_INDEX_POWER = 0;
    const PIN_INDEX_OUTPUT = 1;

    this.initialize = body => {
        _body = body;
    };

    this.tick = state => {
        if (state[context.pins[PIN_INDEX_POWER]] === 1) {
            const value = Math.max(0, Math.min(1, -_body.getPosition().y / MAX_ALTITUDE));

            state[context.pins[PIN_INDEX_OUTPUT]] = value;

            _spring.setTarget(value * Math.PI);
        }
        else {
            state[context.pins[PIN_INDEX_OUTPUT]] = 0;

            _spring.setTarget(0);
        }
    };

    this.update = timeStep => {
        _spring.update(timeStep);

        const dialTransform = context.renderer.getTransforms()[SPRITE_INDEX_DIAL];

        dialTransform.identity();
        dialTransform.translate(context.refs.Scale.PIXELS_PER_POINT, 1);
        dialTransform.rotate(-_spring.getValue());
        dialTransform.translate(-context.refs.Scale.PIXELS_PER_POINT, -context.refs.Scale.PIXELS_PER_POINT * 0.5 - 1);
    };
}
