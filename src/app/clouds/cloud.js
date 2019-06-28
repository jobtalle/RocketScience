import Myr from "myr.js";
import {StyleUtils} from "../utils/styleUtils";

/**
 * A renderable cloud.
 * @param {Myr} myr A Myriad instance.
 * @param {Number} base The width of the cloud base.
 * @constructor
 */
export function Cloud(myr, base) {
    if (!Cloud.SHADER)
        Cloud.SHADER = Cloud.makeShader(myr);

    const paintCloud = () => {
        const paintSphere = (x, y, radius) => {
            const step = Math.PI * -2 / Cloud.SPHERE_PRECISION;
            let dxEnd = 1;
            let dyEnd = 0;

            for (let i = 0; i < Cloud.SPHERE_PRECISION; ++i) {
                const dxStart = dxEnd;
                const dyStart = dyEnd;

                dxEnd = Math.cos((i + 1) * step);
                dyEnd = Math.sin((i + 1) * step);

                myr.primitives.drawTriangleGradient(
                    new Myr.Color(
                        0,
                        0,
                        1,
                        1),
                    x,
                    y,
                    new Myr.Color(
                        dxStart * 0.5 + 0.5,
                        dyStart * 0.5 + 0.5,
                        0.5,
                        1),
                    x + dxStart * radius,
                    y + dyStart * radius,
                    new Myr.Color(
                        dxEnd * 0.5 + 0.5,
                        dyEnd * 0.5 + 0.5,
                        0.5,
                        1),
                    x + dxEnd * radius,
                    y + dyEnd * radius);
            }
        };

        const source = new myr.Surface(base, Math.round(base * 0.5));
        const surface = new myr.Surface(source.getWidth(), source.getHeight());

        source.bind();
        source.setClearColor(Myr.Color.BLUE);
        source.clear();

        paintSphere(10, 10, 10);
        paintSphere(30, 20, 20);
        paintSphere(50, 40, 20);

        surface.bind();
        surface.setClearColor(Myr.Color.RED);
        surface.clear();

        Cloud.SHADER.setSurface("source", source);
        Cloud.SHADER.setSize(source.getWidth(), source.getHeight());
        Cloud.SHADER.draw(0, 0);

        myr.flush();
        source.free();

        return surface;
    };

    const _surface = paintCloud();

    /**
     * Draw this cloud.
     * @param {Number} x The X position in pixels to draw this cloud at from its center.
     * @param {Number} y The Y position of the base of the cloud in pixels.
     */
    this.draw = (x, y) => {
        _surface.draw(x - _surface.getWidth() * 0.5, y - _surface.getHeight());
    };

    /**
     * Free all resources maintained by this cloud.
     */
    this.free = () => {
        _surface.free();
    };
}

Cloud.SPHERE_PRECISION = 16;
Cloud.COLOR_BORDER = StyleUtils.getColor("--game-color-cloud-border");
Cloud.COLOR_FILL = StyleUtils.getColor("--game-color-cloud-fill");
Cloud.COLOR_SHADE = StyleUtils.getColor("--game-color-cloud-shade");
Cloud.SHADER = null;
Cloud.makeShader = myr => {
    return new myr.Shader(
        "void main() {" +
        "color = texture(source, uv);" +
        "}",
        ["source"],
        []);
};