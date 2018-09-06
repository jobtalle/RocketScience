import * as Myr from "../../../../../lib/myr";
import {createPolygonShape} from "./polygon";

const sensorShape = [
    new Myr.Vector(0, 0),
    new Myr.Vector(0, 1),
    new Myr.Vector(1, 0.5)];

export function createSensorShape(direction) {
    const transform = new Myr.Transform();
    const polygon = [];

    transform.rotate(direction);

    for (const vector of sensorShape) {
        const transformed = vector.copy();

        transform.apply(transformed);
        polygon.push(transformed);
    }

    return createPolygonShape(polygon, 0, 0);
}