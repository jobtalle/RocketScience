import {PcbRenderer} from "../pcb/pcbRenderer";
import {PcbShape} from "../pcb/pcbShape";
import {PcbState} from "../pcb/pcbState";
import {Pcb} from "../pcb/pcb";
import {Scale} from "./scale";
import Myr from "myr.js"

/**
 * An object in the world.
 * @param {RenderContext} renderContext A render context.
 * @param {Physics} physics Physics engine.
 * @param {ControllerState} controllerState A controller state to read input from.
 * @param {Pcb} pcb Circuit to simulate.
 * @param {Number} x Horizontal coordinate.
 * @param {Number} y Vertical coordinate.
 * @constructor
 */
export function WorldObject(renderContext, physics, controllerState, pcb, x, y) {
    const _renderer = new PcbRenderer(renderContext, pcb, PcbRenderer.LEVEL_HULL);
    const _transform = new Myr.Transform();

    let _state = null;
    let _body = null;

    const createPhysicsBody = () => {
        const shape = new PcbShape(pcb);
        const polygons = [];
        const points = [];

        for (const part of shape.getParts())
            polygons.push(part.getPoints());

        for (let y = 0; y < pcb.getHeight(); ++y) for (let x = 0; x < pcb.getWidth(); ++x)
            if (pcb.getPoint(x, y))
                points.push(new Myr.Vector(
                    (x + 0.5) * Scale.METERS_PER_POINT,
                    (y + 0.5) * Scale.METERS_PER_POINT));

        return physics.createBody(
            polygons,
            points,
            1,
            x,
            y,
            shape.getCenter().x,
            shape.getCenter().y,
            _transform);
    };

    /**
     * Update the state of this object.
     * @param {Number} timeStep The number of seconds passed after the previous update.
     */
    this.update = timeStep => {
        _state.update(timeStep);
    };

    /**
     * Update the PCB for one tick.
     */
    this.tick = () => {
        _state.tick();
    };

    /**
     * Draw the world object in its current state.
     */
    this.draw = () => {
        renderContext.getMyr().push();
        renderContext.getMyr().transform(_transform);

        _renderer.drawBody(0, 0);

        renderContext.getMyr().pop();

        _renderer.drawSeparate();
    };

    /**
     * Free all resources occupied by this object.
     */
    this.free = () => {
        physics.destroyBody(_body);

        _renderer.free();
    };

    /**
     * Check whether this object contains a given vector.
     * @param {Myr.Vector} vector A vector.
     * @returns {Myr.Vector} The coordinate of the point on this pcb that was clicked, or null if nothing was hit.
     */
    this.contains = vector => {
        const normalized = vector.copy();
        const inverseTransform = _transform.copy();

        inverseTransform.invert();
        inverseTransform.apply(normalized);

        const pointX = Math.floor(normalized.x / Scale.PIXELS_PER_POINT);
        const pointY = Math.floor(normalized.y / Scale.PIXELS_PER_POINT);
        const point = pcb.getPoint(pointX, pointY);

        if (point)
            return new Myr.Vector(pointX, pointY);
        else
            return null;
    };

    /**
     * Get this objects physics body.
     * @returns {Object} A physics body.
     */
    this.getBody = () => _body;

    /**
     * Get this objects transformation.
     * @returns {Myr.Transform} The transformation.
     */
    this.getTransform = () => _transform;

    /**
     * Get the pcb this world object is constructed off.
     * @returns {Pcb} A pcb.
     */
    this.getPcb = () => pcb;

    /**
     * Get the state of this object.
     * @returns {PcbState} A state object.
     */
    this.getState = () => _state;

    _body = createPhysicsBody();
    _state = new PcbState(pcb, _renderer, _body, controllerState);
    _renderer.setLevel(PcbRenderer.LEVEL_HULL);
}