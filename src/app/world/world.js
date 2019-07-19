import {View} from "../view/view";
import {Physics} from "./physics/physics";
import {WorldObject} from "./worldObject";
import {ZoomProfile} from "../view/zoomProfile";
import {ShiftProfile} from "../view/shiftProfile";
import {KeyEvent} from "../input/keyboard/keyEvent";
import {MouseEvent} from "../input/mouse/mouseEvent";
import {ControllerState} from "./controllerState";
import {CameraSmooth} from "../view/camera/cameraSmooth";
import {StyleUtils} from "../utils/styleUtils";
import {TerrainRenderer} from "../terrain/terrainRenderer";
import {Scatters} from "../terrain/scatters/scatters";
import {CloudsRenderer} from "./clouds/cloudsRenderer";
import {Scale} from "./scale";
import {Water} from "./water/water";
import {WaterRenderer} from "./water/waterRenderer";
import Myr from "myr.js"
import {Fill} from "../terrain/fills/fill";

/**
 * Simulates physics and led for all objects in the same space.
 * @param {RenderContext} renderContext A render context.
 * @param {MissionProgress} missionProgress A mission to complete in this world.
 * @constructor
 */
export function World(renderContext, missionProgress) {
    const _objects = [];
    const _controllerState = new ControllerState();
    const _water = new Water();
    const _physics = new Physics(missionProgress.getMission().getPhysicsConfiguration(), _water);
    const _waterRenderer = new WaterRenderer(
        renderContext,
        _water,
        renderContext.getWidth(),
        renderContext.getHeight());
    const _cloudsRenderer = new CloudsRenderer(
        renderContext.getMyr(),
        -missionProgress.getMission().getPhysicsConfiguration().getAtmosphereHeight() * Scale.PIXELS_PER_METER,
        0.4);
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
    let _selected = null;
    let _terrainRenderer = null;
    let _surface = new (renderContext.getMyr().Surface)(renderContext.getWidth(), renderContext.getHeight());
    let _tickCounter = 0;
    let _paused = true;
    let _waterLevelTop;

    const clickObject = (x, y) => {
        const at = new Myr.Vector(x, y);

        _view.getInverse().apply(at);

        for (const object of _objects) {
            const point = object.contains(at);

            if (point) {
                _controllerState.onClick(object.getBody(), point);

                if (_selected !== object) {
                    _selected = object;

                    this.setCamera(CameraSmooth, object);
                }

                return true;
            }
        }

        _selected = null;

        this.setCamera(null);

        return false;
    };

    const zoomIn = () => {
        if (_camera)
            _camera.zoomIn();
        else
            _view.zoomIn();
    };

    const zoomOut = () => {
        if (_camera)
            _camera.zoomOut();
        else
            _view.zoomOut();
    };

    /**
     * Update the terrain graphics and physics shape. Call this after modifying terrain.
     */
    this.updateTerrain = () => {
        if (_terrainRenderer)
            _terrainRenderer.free();

        _terrainRenderer = new TerrainRenderer(
            renderContext.getMyr(),
            missionProgress.getMission().getTerrain(),
            new Scatters(
                renderContext,
                missionProgress.getMission().getTerrain()),
            new Fill(
                renderContext,
                missionProgress.getMission().getTerrain()));

        missionProgress.getMission().getTerrain().makeTerrain(_physics);
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
    this.getMission = () => missionProgress.getMission();

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
                if (event.wheelDelta > 0)
                    zoomIn();
                else
                    zoomOut();

                break;
            case MouseEvent.EVENT_MOVE:
                if (_camera)
                    _camera.onMouseMove(event.x, event.y);

                _view.onMouseMove(event.x, event.y);

                break;
            case MouseEvent.EVENT_RELEASE_LMB:
            case MouseEvent.EVENT_RELEASE_RMB:
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
            case MouseEvent.EVENT_PRESS_RMB:
                if (_camera)
                    _camera.onMousePress();
                else
                    _view.onMousePress();

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

        missionProgress.getMission().prime(_objects);

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
        _water.clear();

        while (_objects.length > 0)
            _objects.pop().free();
    };

    /**
     * Update the state of the world.
     * @param {Number} timeStep The number of seconds passed after the previous update.
     */
    this.update = timeStep => {
        if (!_paused) {
            _physics.update(timeStep);
            _water.update(timeStep);

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

            missionProgress.getMission().validate();

            if (ticks)
                _controllerState.tick();

            _cloudsRenderer.shift(World.WIND * Scale.PIXELS_PER_METER * timeStep);
        }

        const left = _view.getOrigin().x;
        const right = left + _view.getWidth() / _view.getZoom();
        const top = _view.getOrigin().y;
        const bottom = top + _view.getHeight() / +_view.getZoom();
        const waterY = -_view.getOrigin().y * _view.getZoom();

        _waterLevelTop = Math.round(waterY + Math.ceil(_water.getTop() * _view.getZoom()));

        _surface.bind();
        _surface.clear();

        renderContext.getMyr().push();
        renderContext.getMyr().transform(_view.getTransform());

        _cloudsRenderer.drawBack(left, right, top, bottom);

        for (let index = 0; index < _objects.length; index++)
            _objects[index].draw();

        _terrainRenderer.draw(left, right);
        _cloudsRenderer.drawFront(left, right, top, bottom);

        renderContext.getMyr().pop();

        if (_waterLevelTop < _surface.getHeight())
            _waterRenderer.update(timeStep, _view.getTransform(), left, right, top, bottom);
    };

    /**
     * Draw the world
     */
    this.draw = () => {
        // TODO: Draw sky gradient
        renderContext.getMyr().setClearColor(World.COLOR_SKY);
        renderContext.getMyr().clear();

        if (_waterLevelTop > 0)
            _surface.drawPart(
                0,
                0,
                0,
                0,
                _surface.getWidth(),
                Math.min(_waterLevelTop, _surface.getHeight()));

        if (_waterLevelTop < _surface.getHeight())
            _waterRenderer.drawPart(
                0,
                Math.max(0, _waterLevelTop),
                0,
                Math.max(0, _waterLevelTop),
                _surface.getWidth(),
                _surface.getHeight() - Math.max(0, _waterLevelTop));
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

        _waterRenderer.resize(width, height);
        _waterRenderer.setSurface(_surface);
    };

    /**
     * Free all resources occupied by the world
     */
    this.free = () => {
        _cloudsRenderer.free();
        _terrainRenderer.free();
        _surface.free();
        _physics.free();
    };

    _view.focus(-missionProgress.getMission().getTerrain().getWidth() * 0.5, 0, 0.5);

    this.updateTerrain();

    _waterRenderer.setSurface(_surface);
}

World.COLOR_SKY = StyleUtils.getColor("--game-color-sky");
World.ZOOM_FACTOR = 0.25;
World.ZOOM_MIN = 0.25;
World.ZOOM_MAX = 8;
World.TPS = 15;
World.TICK_DELAY = 1 / World.TPS;
World.WIND = 0.15;