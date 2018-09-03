import {Box2D} from "../../../../lib/box2d";

export const box2d = new Box2D();
export const getb2Vec2 = (x, y) => {
    _tempVec.set_x(x);
    _tempVec.set_y(y);

    return _tempVec;
};

const _tempVec = new box2d.b2Vec2(0, 0);