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

    const fillSphereArea = sphereSet => {
        if (sphereSet.spheres.length < 2)
            return;

        for (let i = 1; i < sphereSet.spheres.length; ++i) {
            myr.primitives.drawTriangle(
                Cloud.NORMAL_SHADE,
                sphereSet.spheres[i - 1].x - sphereSet.xMin, -sphereSet.yMin,
                sphereSet.spheres[i - 1].x - sphereSet.xMin, sphereSet.spheres[i - 1].y - sphereSet.yMin,
                sphereSet.spheres[i].x - sphereSet.xMin, sphereSet.spheres[i].y - sphereSet.yMin);
            myr.primitives.drawTriangle(
                Cloud.NORMAL_SHADE,
                sphereSet.spheres[i].x - sphereSet.xMin, sphereSet.spheres[i].y - sphereSet.yMin,
                sphereSet.spheres[i].x - sphereSet.xMin, -sphereSet.yMin,
                sphereSet.spheres[i - 1].x - sphereSet.xMin, -sphereSet.yMin);
        }
    };

    const paintCloud = () => {
        const sphereSet = Cloud.makeSpheres(base);
        const source = new myr.Surface(
            Math.round(sphereSet.xMax - sphereSet.xMin),
            Math.round(sphereSet.yMax - sphereSet.yMin));
        const surface = new myr.Surface(source.getWidth(), source.getHeight());

        source.bind();

        fillSphereArea(sphereSet);

        for (const sphere of sphereSet.spheres)
            paintSphere(
                sphere.x - sphereSet.xMin,
                sphere.y - sphereSet.yMin,
                sphere.radius);

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
     * Get the base size of this cloud.
     * @returns {Number} The base width in pixels.
     */
    this.getBase = () => base;

    /**
     * Free all resources maintained by this cloud.
     */
    this.free = () => {
        _surface.free();
    };
}

Cloud.Sphere = function(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
};

Cloud.makeSpheres = base => {
    const shape = new FractalNoise(Math.random(), 1 / Cloud.SPHERE_RADIUS_MAX * 3, 3);
    const spheres = [];
    let x = 0;

    while (x < base) {
        const amp = 1 - (2 * (x / base) - 1) * (2 * (x / base) - 1);
        const noiseY = 0.5 + 0.5 * shape.sample(x);
        const y = -(noiseY * noiseY) * base * Cloud.HEIGHT_FACTOR * amp;
        const xp = x;
        let radius = Cloud.SPHERE_RADIUS_MIN + (Cloud.SPHERE_RADIUS_MAX - Cloud.SPHERE_RADIUS_MIN) * Math.random() * amp;

        x += radius * Cloud.SPACING;

        if (spheres.length !== 0) {
            const dx = x - spheres[spheres.length - 1].x;
            const dy = y - radius - spheres[spheres.length - 1].y;
            const d = Math.sqrt(dx * dx + dy * dy) - spheres[spheres.length - 1].radius - radius;

            if (d > 0) {
                x = xp - spheres[spheres.length - 1].radius * Cloud.SPACING_CORRECTION;

                continue;
            }
        }

        const sphere = new Cloud.Sphere(x, y - radius, radius);

        spheres.push(sphere);

        x += radius * Cloud.SPACING;
    }

    spheres[spheres.length - 1].y = -spheres[spheres.length - 1].radius;

    let xMin = 0;
    let xMax = 0;
    let yMin = 0;
    let yMax = 0;

    for (const sphere of spheres) {
        if (sphere.x - sphere.radius < xMin)
            xMin = sphere.x - sphere.radius;
        if (sphere.x + sphere.radius > xMax)
            xMax = sphere.x + sphere.radius;
        if (sphere.y - sphere.radius < yMin)
            yMin = sphere.y - sphere.radius;
        if (sphere.y + sphere.radius > yMax)
            yMax = sphere.y + sphere.radius;
    }

    return {
        xMin: xMin,
        yMin: yMin,
        xMax: xMax,
        yMax: yMax,
        spheres: spheres
    };
};

Cloud.SPHERE_PRECISION = 24;
Cloud.SPHERE_RADIUS_MIN = 8;
Cloud.SPHERE_RADIUS_MAX = 46;
Cloud.COLOR_BORDER = StyleUtils.getColor("--game-color-cloud-border");
Cloud.COLOR_FILL = StyleUtils.getColor("--game-color-cloud-fill");
Cloud.COLOR_SHADE = StyleUtils.getColor("--game-color-cloud-shade");
Cloud.NORMAL_SHADE = new Myr.Color(
    Math.sqrt(2) * -0.25 + 0.5,
    Math.sqrt(2) * 0.25 + 0.5,
    0.5);
Cloud.SPACING = 0.7;
Cloud.SPACING_CORRECTION = 0.1;
Cloud.HEIGHT_FACTOR = 0.2;
Cloud.SHADER = null;
Cloud.makeShader = myr => {
    return new myr.Shader(
        "void main() {" +
        "mediump vec4 source = texture(source, uv).xyzw;" +
        "mediump vec3 normal = normalize((source.xyz - vec3(0.5)) * 2.0);" +
        "if (dot(normalize(vec3(0.5, -0.5, 1)), normal) < 0.5 * uv.y)" +
        "color = vec4(" +
        Number(Cloud.COLOR_SHADE.r).toFixed(2) + ", " +
        Number(Cloud.COLOR_SHADE.g).toFixed(2) + ", " +
        Number(Cloud.COLOR_SHADE.b).toFixed(2) + ", " +
        Number(Cloud.COLOR_SHADE.a).toFixed(2) + " * source.w);" +
        "else " +
        "color = vec4(" +
        Number(Cloud.COLOR_FILL.r).toFixed(2) + ", " +
        Number(Cloud.COLOR_FILL.g).toFixed(2) + ", " +
        Number(Cloud.COLOR_FILL.b).toFixed(2) + ", " +
        Number(Cloud.COLOR_FILL.a).toFixed(2) + " * source.w);" +
        "}",
        ["source"],
        []);
};