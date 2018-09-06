import {box2d} from "./box2d";

export function Fixture(shape, category, mask) {
    const _definition = new box2d.b2FixtureDef();

    this.getDefinition = () => _definition;
    this.free = () => box2d.destroy(_definition);

    _definition.set_shape(shape);

    if (category) {
        _definition.get_filter().set_categoryBits(category);
        _definition.get_filter().set_maskBits(mask);
        _definition.set_density(5);
    }
    else {
        _definition.set_isSensor(true);
        _definition.set_density(0);
    }
}