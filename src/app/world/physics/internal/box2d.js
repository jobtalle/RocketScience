import {Box2D} from "../../../../lib/box2d";

const getB2Vec2 = (x, y) => {
    _tempVec.set_x(x);
    _tempVec.set_y(y);

    return _tempVec;
};

export const box2d = new Box2D();
export const getb2Vec2 = getB2Vec2;
export const getb2Vec2A = getB2Vec2;
export const getb2Vec2B = (x, y) => {
    _tempVec2.set_x(x);
    _tempVec2.set_y(y);

    return _tempVec2;
};

const _tempVec = new box2d.b2Vec2(0, 0);
const _tempVec2 = new box2d.b2Vec2(0, 0);