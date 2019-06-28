import Myr from "myr.js";
import {StyleUtils} from "../utils/styleUtils";
import {FractalNoise} from "../utils/fractalNoise";

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
        const Sphere = function(x, y, radius) {
            this.x = x;
            this.y = y;
            this.radius = radius;
        };

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
                        0.5,
                        0.5,
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

        const shape = new FractalNoise(Math.random(), 1 / Cloud.SPHERE_RADIUS_MAX * 3, 3);
        const spheres = [];
        let x = 0;
        let xMin = 0;
        let xMax = 0;
        let yMin = 0;
        let yMax = 0;

        while (x < base) {
            const amp = Math.max(0, 1 - (2 * (x / base) - 1) * (2 * (x / base) - 1));
            const noiseY = 0.5 + 0.5 * shape.sample(x);
            const y = -(noiseY * noiseY) * base * Cloud.HEIGHT_FACTOR * amp;
            const radius = Cloud.SPHERE_RADIUS_MIN + (Cloud.SPHERE_RADIUS_MAX - Cloud.SPHERE_RADIUS_MIN) * Math.random() * amp;

            x += radius * Cloud.SPACING;

            const sphere = new Sphere(x, y - radius, radius);

            spheres.push(sphere);

            if (sphere.x - sphere.radius < xMin)
                xMin = sphere.x - sphere.radius;
            if (sphere.x + sphere.radius > xMax)
                xMax = sphere.x + sphere.radius;
            if (sphere.y - sphere.radius < yMin)
                yMin = sphere.y - sphere.radius;
            if (sphere.y + sphere.radius > yMax)
                yMax = sphere.y + sphere.radius;

            x += radius * Cloud.SPACING;
        }

        spheres[spheres.length - 1].y = -spheres[spheres.length - 1].radius;

        const source = new myr.Surface(Math.round(xMax - xMin), Math.round(yMax - yMin));
        const surface = new myr.Surface(source.getWidth(), source.getHeight());

        source.bind();

        for (const sphere of spheres)
            paintSphere(sphere.x - xMin,sphere.y - yMin, sphere.radius);

        surface.bind();

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

Cloud.SPHERE_PRECISION = 24;
Cloud.SPHERE_RADIUS_MIN = 12;
Cloud.SPHERE_RADIUS_MAX = 40;
Cloud.COLOR_BORDER = StyleUtils.getColor("--game-color-cloud-border");
Cloud.COLOR_FILL = StyleUtils.getColor("--game-color-cloud-fill");
Cloud.COLOR_SHADE = StyleUtils.getColor("--game-color-cloud-shade");
Cloud.SPACING = 0.7;
Cloud.HEIGHT_FACTOR = 0.2;
Cloud.SHADER = null;
Cloud.makeShader = myr => {
    const shader = new myr.Shader(
        "void main() {" +
        "mediump vec4 source = texture(source, uv).xyzw;" +
        "mediump vec3 normal = normalize((source.xyz - vec3(0.5)) * 2.0);" +
        "if (dot(normalize(vec3(0.5, -0.5, 1)), normal) < 0.5 * uv.y)" +
        "color = vec4(rShade, gShade, bShade, aShade * source.w);" +
        "else " +
        "color = vec4(r, g, b, a * source.w);" +
        "}",
        ["source"],
        [
            "r",
            "g",
            "b",
            "a",
            "rShade",
            "gShade",
            "bShade",
            "aShade"
        ]);

    shader.setVariable("r", Cloud.COLOR_FILL.r);
    shader.setVariable("g", Cloud.COLOR_FILL.g);
    shader.setVariable("b", Cloud.COLOR_FILL.b);
    shader.setVariable("a", Cloud.COLOR_FILL.a);
    shader.setVariable("rShade", Cloud.COLOR_SHADE.r);
    shader.setVariable("gShade", Cloud.COLOR_SHADE.g);
    shader.setVariable("bShade", Cloud.COLOR_SHADE.b);
    shader.setVariable("aShade", Cloud.COLOR_SHADE.a);

    return shader;
};