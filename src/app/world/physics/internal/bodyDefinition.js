import {box2d, getb2Vec2} from "./box2d";

export function BodyDefinition() {
    const _definition = new box2d.b2BodyDef();

    _definition.set_type(box2d.b2_dynamicBody);
    _definition.set_position(getb2Vec2(0, 0));

    this.getDefinition = () => _definition;
    this.free = () => box2d.destroy(_definition);
}