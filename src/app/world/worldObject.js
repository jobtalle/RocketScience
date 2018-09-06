import {PcbRenderer} from "../pcb/pcbRenderer";
import {PcbShape} from "../pcb/pcbShape";
import {PcbState} from "../pcb/pcbState";
import * as Myr from "../../lib/myr";

/**
 * An object in the world.
 * @param {Myr} myr Myriad instance.
 * @param {Sprites} sprites SpriteList.
 * @param {Physics} physics Physics engine.
 * @param {Pcb} pcb Circuit to simulate.
 * @param {Number} x Horizontal coordinate.
 * @param {Number} y Vertical coordinate.
 * @constructor
 */
export function WorldObject(myr, sprites, physics, pcb, x, y) {
    const _renderer = new PcbRenderer(myr, sprites, pcb);
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

        _renderer.drawConnected();
    };

    /**
     * Free all resources occupied by this object.
     */
    this.free = () => {
        physics.destroyBody(_body);

        _renderer.free();
    };

    _body = generatePhysicsBody();
    _state = new PcbState(pcb, _renderer, _body);
    _renderer.setLevel(PcbRenderer.LEVEL_HULL);
}