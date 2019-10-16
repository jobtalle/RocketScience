import {box2d} from "./box2d";

/**
 * A fixture, which is a part of a physics body. If only a shape is provided, this fixture is a sensor.
 * @param {Object} shape A Box2D shape.
 * @param {Number} [density] The density of this fixture.
 * @param {Number} [category] The category bit.
 * @param {Number} [mask] The category bit mask.
 * @constructor
 */
export function Fixture(shape, density, category, mask) {
    const _definition = new box2d.b2FixtureDef();

    this.getDefinition = () => _definition;
    this.free = () => box2d.destroy(_definition);

    _definition.set_shape(shape);

    if (density !== undefined) {
        _definition.get_filter().set_categoryBits(category);
        _definition.get_filter().set_maskBits(mask);
        _definition.set_density(density);
    }
    else {
        // Sensors have no density
        _definition.set_isSensor(true);
        _definition.set_density(0);
    }
}