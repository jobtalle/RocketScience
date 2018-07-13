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
    const _pcbRenderer = new PcbRenderer(myr, sprites, pcb);

    let _physicsObject = null;

    const generatePhysicsBody = () => {
        const polygonPoints = [];
        return physics.createObject(polygonPoints, x, y);
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
        const x = _physicsObject.getTransform().x * Terrain.PIXELS_PER_METER;
        const y = _physicsObject.getTransform().y * Terrain.PIXELS_PER_METER;
        _pcbRenderer.draw(x, y);
    };

    /**
     * Free all resources occupied by this object.
     */
    this.free = () => {
        _pcbRenderer.free();

        console.log("Free");
    };

    _physicsObject = generatePhysicsBody();
    _pcbRenderer.revalidate();
}