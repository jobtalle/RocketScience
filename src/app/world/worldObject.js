import {PcbRenderer} from "../pcb/pcbRenderer";
import {Terrain} from "./terrain";

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

    let _body = null;

    const generatePhysicsBody = () => {
        const polygonPoints = [];

        return physics.createBody(polygonPoints, x, y);
    };

    /**
     * Update the state of this object.
     * @param {Number} timeStep The number of milliseconds passed after the previous update.
     */
    this.update = timeStep => {
        // TODO: Update pcb.
    };

    /**
     * Draw the world object in its current state.
     */
    this.draw = () => {
        _renderer.drawTransformed(_body.getTransform());
    };

    /**
     * Free all resources occupied by this object.
     */
    this.free = () => {
        physics.destroyBody(_body);

        _renderer.free();
    };

    _body = generatePhysicsBody();
    _renderer.revalidate();
}