import {Terrain} from "./terrain/terrain";
import {View} from "../view/view";
import {Physics} from "./physics";
import {WorldObject} from "./worldObject";
import {ZoomProfile} from "../view/zoomProfile";
import {ShiftProfile} from "../view/shiftProfile";
import Myr from "../../lib/myr";
import {TerrainRugged} from "./terrain/terrainRugged";

/**
 * Simulates physics and behavior for all objects in the same space.
 * @param {Myr} myr A Myriad instance.
 * @param {Sprites} sprites An instantiated Sprites object
 * @param {Number} width The viewport width.
 * @param {Number} height The viewport height.
 * @constructor
 */
export function World(myr, sprites, width, height) {
    const COLOR_CLEAR = new Myr.Color(0.5, 0.6, 0.7);
    const ZOOM_FACTOR = 0.25;
    const ZOOM_MIN = 0.25;
    const ZOOM_MAX = 8;
    const GRAVITY = 9.81;

    const _objects = [];
    const _physics = new Physics(GRAVITY);
    const _terrain = new Terrain(myr, new TerrainRugged(Math.random(), 100, 0, 1));
    const _surface = new myr.Surface(width, height);
    const _view = new View(
        width,
        height,
        new ZoomProfile(
            ZoomProfile.TYPE_CONTINUOUS,
            ZOOM_FACTOR,
            1,
            ZOOM_MIN,
            ZOOM_MAX),
        new ShiftProfile(
            0));

    let _paused = false;

    /**
     * Add a new pcb to simulate in the world.
     * @param {Pcb} pcb The pcb to add.
     * @param {Number} x The x-position.
     * @param {Number} y The y-position.
     */
    this.addPcb = (pcb, x, y) => {
        _objects.push(new WorldObject(myr, sprites, _physics, pcb, x, y));
    };

    this.getView = () => _view;

    /**
     * Press the mouse.
     */
    this.onMousePress = () => {
        _view.onMousePress();
    };

    /**
     * Release the mouse.
     */
    this.onMouseRelease = () => {
        _view.onMouseRelease();
    };

    /**
     * Move the mouse.
     * @param {Number} x The mouse x position in pixels.
     * @param {Number} y The mouse y position in pixels.
     */
    this.onMouseMove = (x, y) => {
        _view.onMouseMove(x, y);
    };

    /**
     * Zoom in.
     */
    this.zoomIn = () => {
        _view.zoomIn();
    };

    /**
     * Zoom out.
     */
    this.zoomOut = () => {
        _view.zoomOut();
    };

    /**
     * Pause the world.
     */
    this.pause = () => {
        _paused = true;
    };

    /**
     * Unpause the world.
     */
    this.unpause = () => {
        _paused = false;
    };

    /**
     * Activate the world.
     */
    this.activate = () => {

    };

    /**
     * Deactivate the world.
     */
    this.deactivate = () => {
        _view.onMouseRelease();
        return;
        while (_objects.length > 0)
            _objects.pop().free();
    };

    /**
     * Update the state of the world.
     * @param {Number} timeStep The number of seconds passed after the previous update.
     */
    this.update = timeStep => {
        if (!_paused)
            _physics.update(timeStep);

        for (let index = 0; index < _objects.length; index++)
            _objects[index].update(timeStep);

        _surface.bind();
        _surface.clear();

        myr.push();
        myr.transform(_view.getTransform());

        _terrain.draw();

        for (let index = 0; index < _objects.length; index++)
            _objects[index].draw(myr);

        myr.pop();
    };

    /**
     * Draw the world
     */
    this.draw = () => {
        _surface.draw(0, 0);
    };

    /**
     * Free all resources occupied by the world
     */
    this.free = () => {
        this.deactivate();

        _physics.free();
    };

    _view.focus(-_terrain.getWidth() * 0.5, 0, 0.5);
    _surface.setClearColor(COLOR_CLEAR);
    _terrain.makeTerrain(_physics);
}