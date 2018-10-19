import {PcbRenderer} from "../pcb/pcbRenderer";
import {PcbShape} from "../pcb/pcbShape";
import {PcbState} from "../pcb/pcbState";
import {Pcb} from "../pcb/pcb";
import * as Myr from "../../lib/myr";

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

    const generatePhysicsBody = () => {
        const shape = new PcbShape(pcb);
        const polygons = [];

        for (const part of shape.getParts())
            polygons.push(part.getPoints());

        return physics.createBody(polygons, x, y, shape.getCenter().x, shape.getCenter().y, _transform);
    };

    /**
     * Update the state of this object.
     * @param {Number} timeStep The number of milliseconds passed after the previous update.
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
     * @param {Myr} myr A Myriad instance.
     */
    this.draw = myr => {
        myr.push();
        myr.transform(_transform);

        _renderer.drawBody(0, 0);

        myr.pop();

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

        const pointX = Math.floor(normalized.x / Pcb.PIXELS_PER_POINT);
        const pointY = Math.floor(normalized.y / Pcb.PIXELS_PER_POINT);
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
     * Get the pcb this world object is constructed off.
     * @returns {Pcb} A pcb.
     */
    this.getPcb = () => pcb;

    /**
     * Get the state of this object.
     * @returns {PcbState} A state object.
     */
    this.getState = () => _state;

    _body = generatePhysicsBody();
    _state = new PcbState(pcb, _renderer, _body, controllerState);
    _renderer.setLevel(PcbRenderer.LEVEL_HULL);
}