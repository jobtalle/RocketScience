import {StyleUtils} from "../../utils/styleUtils";
import {Water} from "./water";
import Myr from "myr.js";

/**
 * A water renderer.
 * @param {Myr} myr A Myriad instance.
 * @param {Water} water A water object.
 * @param {Number} width The view width in pixels.
 * @param {Number} height The view height in pixels.
 * @constructor
 */
export function WaterRenderer(myr, water, width, height) {
    const _shader = WaterRenderer.makeShader(myr);
    let _surface = null;

    /**
     * Update the water renderer. Call this before rendering.
     * @param {Myr.Transform} transform A world view transformation.
     * @param {Number} left The left position of the viewport in pixels.
     * @param {Number} right The right position of the viewport in pixels.
     * @param {Number} bottom The bottom position of the viewport in pixels.
     */
    this.update = (transform, left, right, bottom) => {
        _surface.bind();
        _surface.clear();

        myr.push();
        myr.transform(transform);

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

            myr.primitives.drawTriangleGradient(
                Myr.Color.WHITE,
                xLeft, dLeft,
                Myr.Color.WHITE,
                xLeft, bottom,
                Myr.Color.WHITE,
                xRight, bottom);
            myr.primitives.drawTriangleGradient(
                Myr.Color.WHITE,
                xRight, bottom,
                Myr.Color.WHITE,
                xRight, dRight,
                Myr.Color.WHITE,
                xLeft, dLeft);
        }

        myr.pop();
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

        _surface = new myr.Surface(width, height);
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
        _surface.free();
        _shader.free();
    };

    this.resize(width, height);
}

WaterRenderer.SURFACE_THICKNESS = 8;
WaterRenderer.COLOR_WATER_TOP = StyleUtils.getColor("--game-color-water-top");
WaterRenderer.COLOR_WATER_BOTTOM = StyleUtils.getColor("--game-color-water-bottom");
WaterRenderer.makeShader = (myr) => {
    return new myr.Shader(
        "void main() {" +
        "mediump vec4 pixelWorld = texture(world, uv).rgba;" +
        "mediump vec4 pixelWater = texture(water, uv).rgba;" +
        "if (pixelWater.a == 0.0) discard;" +
        "color = vec4(pixelWorld.rgb * 0.5, pixelWorld.a);" +
        "}",
        [
            "world",
            "water"
        ],
        []);
};