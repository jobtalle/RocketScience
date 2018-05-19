import test from 'ava';
import Polygon from "./polygon";

const Vector = function(x, y) {
    this.x = x;
    this.y = y;
    this.equals = other => {
        return this.x === other.x && this.y === other.y;
    }
};

test('Nothing is not a polygon.', t => {
    const nothing = [];
    try {
        const polygon = new Polygon(nothing);
        t.fail();
    } catch (exception) {
        t.is(exception, Polygon.NOT_CONVEX);
    }
});

test('A point is not convex.', t => {
    const point = [new Vector(0, 0)];
    try {
        const polygon = new Polygon(point);
        t.fail();
    } catch (exception) {
        t.is(exception, Polygon.NOT_CONVEX);
    }
});

test('A triangle is convex.', t => {
    const triangle = [new Vector(0, 0), new Vector(1, 0), new Vector(0.5, 1)];
    try {
        const polygon = new Polygon(triangle);
        t.pass();
    } catch (exception) {
        t.fail(exception);
    }
});

test('A square is convex.', t => {
    const square = [new Vector(0, 0), new Vector(1, 0),
                    new Vector(1, 1), new Vector(0, 1)];
    try {
        const polygon = new Polygon(square);
        t.pass();
    } catch (exception) {
        t.fail(exception);
    }
});

test('A dented square is not convex.', t => {
    const square = [new Vector(0, 0), new Vector(1, 0),
                    new Vector(1, 1), new Vector(0.5, 0.5), new Vector(0, 1)];
    try {
        const polygon = new Polygon(square);
        t.fail();
    } catch (exception) {
        t.pass();
    }
});