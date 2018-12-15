import {createPolygonShape} from "./polygon";
import Myr from "myr.js"

const sensorShape = [
    new Myr.Vector(0.5, -0.5),
    new Myr.Vector(0.5, 0.5),
    new Myr.Vector(1, 0)];

export function createSensorShape(x, y, size, direction) {
    const transform = new Myr.Transform();
    const polygon = [];

    transform.translate(x, y);
    transform.rotate(direction);
    transform.scale(size, size);

    for (const vector of sensorShape) {
        const transformed = vector.copy();

        transform.apply(transformed);
        polygon.push(transformed);
    }

    return createPolygonShape(polygon, 0, 0);
}