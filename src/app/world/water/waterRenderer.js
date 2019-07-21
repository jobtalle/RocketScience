import {Water} from "./water";
import {Scale} from "../scale";
import {Terrain} from "../../terrain/terrain";
import Myr from "myr.js";
import {cubicNoiseConfig, cubicNoiseSample2} from "../../utils/cubicNoise";
import {RenderContext} from "../../renderContext";

/**
 * A water renderer.
 * @param {RenderContext} renderContext A render context.
 * @param {Water} water A water object.
 * @param {Number} width The view width in pixels.
 * @param {Number} height The view height in pixels.
 * @constructor
 */
export function WaterRenderer(renderContext, water, width, height, view) {
    const _gradient = WaterRenderer.makeGradient(renderContext);
    const _noise = WaterRenderer.makeNoise(renderContext.getMyr());
    const _shader = WaterRenderer.makeShader(renderContext.getMyr(), _gradient, _noise);
    const _surfaceParticle = new (renderContext.getMyr().Surface)(
        WaterRenderer.PARTICLE_RESOLUTION,
        WaterRenderer.PARTICLE_RESOLUTION,
        0, true, false);
    let _surface = null;
    let _noiseShift = 0;

    const makeParticle = () => {
        _surfaceParticle.setClearColor(WaterRenderer.PARTICLE_COLOR_OUTER);
        _surfaceParticle.bind();
        _surfaceParticle.clear();

        renderContext.getMyr().primitives.fillCircleGradient(
            WaterRenderer.PARTICLE_COLOR_INNER,
            WaterRenderer.PARTICLE_COLOR_OUTER,
            WaterRenderer.PARTICLE_RESOLUTION * 0.5,
            WaterRenderer.PARTICLE_RESOLUTION * 0.5,
            WaterRenderer.PARTICLE_RESOLUTION * 0.5);
    };

    /**
     * Update the water renderer. Call this before rendering.
     * @param {Number} timeStep The amount of time time that has passed since the last update.
     * @param {Myr.Transform} transform A world view transformation.
     * @param {Number} left The left position of the viewport in pixels.
     * @param {Number} right The right position of the viewport in pixels.
     * @param {Number} top The top position of the viewport in pixels.
     * @param {Number} bottom The bottom position of the viewport in pixels.
     */
    this.update = (timeStep, transform, left, right, top, bottom) => {
        _noiseShift += timeStep * WaterRenderer.NOISE_SPEED;

        if (_noiseShift > 1)
            _noiseShift -= 1;

        _surface.bind();
        _surface.clear();

        renderContext.getMyr().push();
        renderContext.getMyr().scale(
            1 / view.getZoom(),
            1 / view.getZoom());
        renderContext.getMyr().transform(transform);

        const opaqueBoundary = Terrain.MAX_DEPTH * Scale.PIXELS_PER_METER;
        const iLeft = Math.floor(left / Water.INTERVAL);
        const iRight = Math.ceil(right / Water.INTERVAL);
        let dLeft = 0;
        let xLeft = 0;
        let dRight = water.sampleIndex(iLeft);
        let xRight = iLeft * Water.INTERVAL;

        for (let i = iLeft; i < iRight; ++i) {
            dLeft = dRight;
            xLeft = xRight;
            dRight = water.sampleIndex(i + 1);
            xRight = (i + 1) * Water.INTERVAL;

            renderContext.getMyr().primitives.drawTriangleGradient(
                WaterRenderer.COLOR_TOP,
                xLeft, dLeft,
                WaterRenderer.COLOR_PRESSURE,
                xLeft, dLeft + WaterRenderer.SURFACE_THICKNESS,
                WaterRenderer.COLOR_PRESSURE,
                xRight, dRight +  + WaterRenderer.SURFACE_THICKNESS);
            renderContext.getMyr().primitives.drawTriangleGradient(
                WaterRenderer.COLOR_PRESSURE,
                xRight, dRight +  + WaterRenderer.SURFACE_THICKNESS,
                WaterRenderer.COLOR_TOP,
                xRight, dRight,
                WaterRenderer.COLOR_TOP,
                xLeft, dLeft);

            renderContext.getMyr().primitives.drawTriangleGradient(
                WaterRenderer.COLOR_PRESSURE,
                xLeft, dLeft + WaterRenderer.SURFACE_THICKNESS,
                WaterRenderer.COLOR_BOTTOM,
                xLeft, opaqueBoundary,
                WaterRenderer.COLOR_BOTTOM,
                xRight, opaqueBoundary);
            renderContext.getMyr().primitives.drawTriangleGradient(
                WaterRenderer.COLOR_BOTTOM,
                xRight, opaqueBoundary,
                WaterRenderer.COLOR_PRESSURE,
                xRight, dRight + WaterRenderer.SURFACE_THICKNESS,
                WaterRenderer.COLOR_PRESSURE,
                xLeft, dLeft + WaterRenderer.SURFACE_THICKNESS);
        }

        for (const particle of water.getParticles()) {
            const scale = (particle.radius + particle.radius) / WaterRenderer.PARTICLE_RESOLUTION;

            _surfaceParticle.drawScaled(
                particle.x - particle.radius,
                particle.y - particle.radius,
                scale,
                scale);
        }

        if (bottom > opaqueBoundary)
            renderContext.getMyr().primitives.fillRectangle(
                WaterRenderer.COLOR_BOTTOM,
                left,
                opaqueBoundary,
                right - left,
                bottom - opaqueBoundary);

        renderContext.getMyr().pop();

        _shader.setVariable("shift", _noiseShift);
        _shader.setVariable("top", top / WaterRenderer.NOISE_SCALE);
        _shader.setVariable("left", left / WaterRenderer.NOISE_SCALE);
        _shader.setVariable("xScale", (right - left) / WaterRenderer.NOISE_SCALE);
        _shader.setVariable("yScale", (bottom - top) / WaterRenderer.NOISE_SCALE);
        _shader.setVariable("xPixel", 1 / (right - left));
        _shader.setVariable("yPixel", 1 / (bottom - top));
    };

    /**
     * Set the world surface to render behind the water.
     * @param {Myr.Surface} surface The world render target.
     */
    this.setSurface = surface => {
        _shader.setSurface("world", surface);
    };

    /**
     * Resize the water.
     * @param {Number} width The width of the window to render to.
     * @param {Number} height The height of the window to render to.
     */
    this.resize = (width, height) => {
        if (_surface)
            _surface.free();

        _surface = new (renderContext.getMyr().Surface)(
            width / view.getZoom(),
            height / view.getZoom());
        _surface.setClearColor(new Myr.Color(0, 0, 0, 0));
        _shader.setSurface("water", _surface);
        _shader.setSize(width, height);
    };

    /**
     * Draw a part of this water renderer.
     * @param {Number} x The X position to start rendering at.
     * @param {Number} y The Y position to start rendering at.
     * @param {Number} left The left position to start rendering from.
     * @param {Number} top The top position to start rendering from.
     * @param {Number} width The width of the rendering.
     * @param {Number} height The height of the rendering.
     */
    this.drawPart = (x, y, left, top, width, height) => {
        _shader.drawPart(x, y, left, top, width, height);
    };

    /**
     * Free all resources maintained by this water renderer.
     */
    this.free = () => {
        _noise.free();
        _gradient.free();
        _surface.free();
        _shader.free();
        _surfaceParticle.free();
    };

    this.resize(width, height);

    makeParticle();
}

WaterRenderer.SURFACE_THICKNESS = 16;
WaterRenderer.PRECISION = 1 / 32;
WaterRenderer.NOISE_RESOLUTION = 128;
WaterRenderer.NOISE_SCALE = 128;
WaterRenderer.NOISE_PERIOD = 4;
WaterRenderer.NOISE_SPEED = 0.25;
WaterRenderer.NOISE_DISPLACEMENT = 1.8;
WaterRenderer.COLOR_TOP = new Myr.Color(0, 0, 0, 1);
WaterRenderer.COLOR_PRESSURE = new Myr.Color(WaterRenderer.SURFACE_THICKNESS / (Terrain.MAX_DEPTH * Scale.PIXELS_PER_METER), 1, 0, 1);
WaterRenderer.COLOR_BOTTOM = new Myr.Color(1, 1, 0, 1);
WaterRenderer.PARTICLE_RESOLUTION = 64;
WaterRenderer.PARTICLE_COLOR_INNER = new Myr.Color(0, 1, 0, 0.15);
WaterRenderer.PARTICLE_COLOR_OUTER = new Myr.Color(0, 1, 0, 0);
WaterRenderer.SPRITE_GRADIENT = "water";
WaterRenderer.makeShader = (myr, gradient, noise) => {
    const shader = new myr.Shader(
        "void main() {" +
        "mediump vec4 pixelWater = texture(water, uv).rgba;" +
        "if (pixelWater.a == 0.0)" +
        "color = texture(world, uv).rgba;" +
        "else {" +
        "mediump vec2 noiseSample = texture(noise, mod(vec2(left, top + shift) + uv * vec2(xScale, yScale), 1.0)).xy;" +
        "mediump vec2 distortion = noiseSample * 2.0 - vec2(1.0);" +
        "mediump vec2 sampleLocation = uv + distortion * vec2(xPixel, yPixel) * " + Number(WaterRenderer.NOISE_DISPLACEMENT).toFixed(1) + ";" +
        "mediump vec4 pixelWorld = texture(world, sampleLocation).rgba;" +
        "mediump vec4 pixelGradient = texture(gradient, vec2(pixelWater.r, pixelWater.g)).rgba;" +
        "mediump vec3 background = mix(texture(gradient, vec2(1.0)).rgb, pixelWorld.rgb, pixelWorld.a);" +
        "color = vec4(mix(background, pixelGradient.rgb, pixelGradient.a), 1);" +
        "}" +
        "}",
        [
            "world",
            "water",
            "gradient",
            "noise",
        ],
        [
            "shift",
            "top",
            "left",
            "xScale",
            "yScale",
            "xPixel",
            "yPixel"
        ]);

    shader.setSurface("gradient", gradient);
    shader.setSurface("noise", noise);

    return shader;
};

WaterRenderer.makeGradient = renderContext => {
    const sprite = renderContext.getSprites().getSprite(WaterRenderer.SPRITE_GRADIENT);
    const surface = new (renderContext.getMyr().Surface)(sprite.getWidth(), sprite.getHeight());

    surface.bind();
    sprite.draw(0, 0);

    return surface;
};

WaterRenderer.makeNoise = myr => {
    const surface = new myr.Surface(WaterRenderer.NOISE_RESOLUTION, WaterRenderer.NOISE_RESOLUTION, 0, true, true);
    const dxConfig = cubicNoiseConfig(
        Math.random(),
        WaterRenderer.NOISE_RESOLUTION / WaterRenderer.NOISE_PERIOD,
        WaterRenderer.NOISE_RESOLUTION / WaterRenderer.NOISE_PERIOD);
    const dyConfig = cubicNoiseConfig(
        Math.random(),
        WaterRenderer.NOISE_RESOLUTION / WaterRenderer.NOISE_PERIOD,
        WaterRenderer.NOISE_RESOLUTION / WaterRenderer.NOISE_PERIOD);

    surface.bind();

    for (let y = 0; y < WaterRenderer.NOISE_RESOLUTION; ++y) for (let x = 0; x < WaterRenderer.NOISE_RESOLUTION; ++x) {
        const xSample = x / WaterRenderer.NOISE_PERIOD;
        const ySample = y / WaterRenderer.NOISE_PERIOD;
        const dxs = cubicNoiseSample2(dxConfig, xSample, ySample);
        const dys = cubicNoiseSample2(dyConfig, xSample, ySample);

        myr.primitives.drawPoint(new Myr.Color(dxs, dys, 0, 1), x, y);
    }

    return surface;
};