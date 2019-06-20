import {Terrain} from "./terrain/terrain";
import {View} from "../view/view";
import {Physics} from "./physics/physics";
import {WorldObject} from "./worldObject";
import {ZoomProfile} from "../view/zoomProfile";
import {ShiftProfile} from "../view/shiftProfile";
import {TerrainRugged} from "./terrain/generators/terrainRugged";
import {KeyEvent} from "../input/keyboard/keyEvent";
import {MouseEvent} from "../input/mouse/mouseEvent";
import {ControllerState} from "./controllerState";
import {CameraSmooth} from "../view/camera/cameraSmooth";
import Myr from "myr.js"

/**
 * Simulates physics and led for all objects in the same space.
 * @param {RenderContext} renderContext A render context.
 * @param {MissionProgress} missionProgress A mission to complete in this world.
 * @constructor
 */
export function World(renderContext, missionProgress) {
    const mission = missionProgress.getMission();
    const _objects = [];
    const _controllerState = new ControllerState();
    const _physics = new Physics(mission.getPhysicsConfiguration());
    const _terrain = new Terrain(renderContext.getMyr(), new TerrainRugged(Math.random(), 100, 0.2, 0.5));
    const _view = new View(
        renderContext.getWidth(),
        renderContext.getHeight(),
        new ZoomProfile(
            ZoomProfile.TYPE_CONTINUOUS,
            World.ZOOM_FACTOR,
            1,
            World.ZOOM_MIN,
            World.ZOOM_MAX),
        new ShiftProfile(
            0));

    let _camera = null;
    let _surface = new (renderContext.getMyr().Surface)(renderContext.getWidth(), renderContext.getHeight());
    let _tickCounter = 0;
    let _paused = true;

    const clickObject = (x, y) => {
        const at = new Myr.Vector(x, y);

        _view.getInverse().apply(at);

        for (const object of _objects) {
            const point = object.contains(at);

            if (point) {
                _controllerState.onClick(object.getBody(), point);

                this.setCamera(CameraSmooth, object);

                return true;
            }
        }

        this.setCamera(null);

        return false;
    };

    /**
     * Get the missionProgress object of world.
     * @return {MissionProgress} A missionProgress.
     */
    this.getMissionProgress = () => missionProgress;

    /**
     * Get this world's mission.
     * @returns {Mission} A mission object.
     */
    this.getMission = () => mission;

    /**
     * Get this world's physics.
     * @returns {Physics} a Physics object.
     */
    this.getPhysics = () => _physics;

    /**
     * Add a new pcb to simulate in the world.
     * @param {Pcb} pcb The pcb to add.
     * @param {Number} x The x-position in meters.
     * @param {Number} y The y-position in meters.
     */
    this.addPcb = (pcb, x, y) => {
        _objects.push(new WorldObject(renderContext, _physics, _controllerState, pcb, x, y));
    };

    /**
     * Get the view object.
     * @returns {View} The view object applied to this world.
     */
    this.getView = () => _view;

    /**
     * A key event has been fired.
     * @param {KeyEvent} event A key event.
     */
    this.onKeyEvent = event => {
        _controllerState.onKeyEvent(event);
    };

    /**
     * A mouse event has been fired.
     * @param {MouseEvent} event A mouse event.
     */
    this.onMouseEvent = event => {
        switch (event.type) {
            case MouseEvent.EVENT_SCROLL:
                if (event.wheelDelta > 0) {
                    if (_camera)
                        _camera.zoomIn();
                    else
                        _view.zoomIn();
                }
                else {
                    if (_camera)
                        _camera.zoomOut();
                    else
                        _view.zoomOut();
                }

                break;
            case MouseEvent.EVENT_MOVE:
                if (_camera)
                    _camera.onMouseMove(event.x, event.y);

                _view.onMouseMove(event.x, event.y);

                break;
            case MouseEvent.EVENT_RELEASE_LMB:
                if (_camera)
                    _camera.onMouseRelease();
                else
                    _view.onMouseRelease();

                break;
            case MouseEvent.EVENT_PRESS_LMB:
                if (!clickObject(event.x, event.y)) {
                    if (_camera)
                        _camera.onMousePress();
                    else
                        _view.onMousePress();
                }

                break;
        }
    };

    /**
     * Set the camera.
     * @param {Function} camera A valid camera constructor, or null.
     * @param {Object} [object] An object to follow, if camera was not null.
     */
    this.setCamera = (camera, object) => {
        if (!camera)
            _camera = null;
        else
            _camera = new camera(_view, object);
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
     * @param {Number} focus The index of the currently focused editable, or -1 if nothing is focused.
     */
    this.activate = focus => {
        this.unpause();

        mission.prime(_objects);

        if (focus !== -1)
            this.setCamera(CameraSmooth, _objects[focus]);
    };

    /**
     * Deactivate the world.
     */
    this.deactivate = () => {
        this.pause();

        _camera = null;
        _view.onMouseRelease();
        _controllerState.reset();

        while (_objects.length > 0)
            _objects.pop().free();
    };

    /**
     * Update the state of the world.
     * @param {Number} timeStep The number of seconds passed after the previous update.
     */
    this.update = timeStep => {
        if (!_paused) {
            _physics.update(1 / 60);

            let ticks = 0;
            _tickCounter -= timeStep;

            while (_tickCounter < 0) {
                _tickCounter += World.TICK_DELAY;

                ++ticks;
            }

            for (let index = 0; index < _objects.length; index++) {
                for (let i = 0; i < ticks; ++i)
                    _objects[index].tick();

                _objects[index].update(timeStep);
            }

            if (_camera)
                _camera.update(timeStep);

            mission.validate();

            if (ticks)
                _controllerState.tick();
        }

        _surface.bind();
        _surface.clear();

        renderContext.getMyr().push();
        renderContext.getMyr().transform(_view.getTransform());

        _terrain.draw(_view.getOrigin().x, _view.getOrigin().x + _view.getWidth() / _view.getZoom());

        for (let index = 0; index < _objects.length; index++)
            _objects[index].draw();

        renderContext.getMyr().pop();
    };

    /**
     * Draw the world
     */
    this.draw = () => {
        _surface.draw(0, 0);
    };

    /**
     * Call when the render context has resized.
     * @param {Number} width The width in pixels.
     * @param {Number} height The height in pixels.
     */
    this.resize = (width, height) => {
        _view.resize(width, height);

        _surface.free();
        _surface = new (renderContext.getMyr().Surface)(renderContext.getWidth(), renderContext.getHeight());
        _surface.setClearColor(World.COLOR_CLEAR);
    };

    /**
     * Free all resources occupied by the world
     */
    this.free = () => {
        _terrain.free();
        _surface.free();
        _physics.free();
    };

    _view.focus(-_terrain.getWidth() * 0.5, 0, 0.5);
    _surface.setClearColor(World.COLOR_CLEAR);
    _terrain.makeTerrain(_physics);
}

World.COLOR_CLEAR = new Myr.Color(0.5, 0.6, 0.7);
World.ZOOM_FACTOR = 0.25;
World.ZOOM_MIN = 0.25;
World.ZOOM_MAX = 8;
World.TPS = 15;
World.TICK_DELAY = 1 / World.TPS;