import {makeOctaves} from "../../utils/octaves";

/**
 * A water plane.
 * @constructor
 */
export function Water() {
    const _octaves = makeOctaves(Water.WAVE_FUNCTION_PHASES, Water.WAVE_FUNCTION_FALLOFF);
    const _particles = [];
    let _top = 0;
    let _phase = 0;

    const updateParticles = timeStep => {
        _top = -Water.AMPLITUDE;

        for (let i = _particles.length; i-- > 0;) {
            const particle = _particles[i];

            particle.vy += timeStep * Water.GRAVITY;
            particle.x += particle.vx * timeStep;
            particle.y += particle.vy * timeStep;
            particle.radius -= Water.PARTICLE_SHRINK * timeStep;

            if (particle.radius < 0 || (particle.vy > 0 && particle.y - particle.radius > Water.AMPLITUDE))
                _particles.splice(i, 1);
            else if (particle.y - particle.radius < _top)
                _top = particle.y - particle.radius;
        }
    };

    /**
     * Update the water.
     * @param {Number} timeStep The number of seconds passed since the last update.
     */
    this.update = timeStep => {
        _phase += timeStep * Water.SPEED;

        if (_phase > Water.WAVE_PHASE_LIMIT)
            _phase -= Water.WAVE_PHASE_LIMIT;

        updateParticles(timeStep);
    };

    /**
     * Get all particles on this water plane.
     * @returns {Array} An array of particles, to be used by the water renderer.
     */
    this.getParticles = () => _particles;

    /**
     * Add a particle.
     * @param {Number} x The X position in pixels.
     * @param {Number} y The Y position in pixels.
     * @param {Number} dx The X velocity in pixels per second.
     * @param {Number} dy The Y velocity in pixels per second.
     * @param {Number} radius The initial radius in pixels.
     */
    this.addParticle = (x, y, dx, dy, radius) => {
        _particles.push(new Water.Particle(x, y, dx, dy, radius));
    };

    /**
     * Clear all particles.
     */
    this.clear = () => {
        _particles.splice(0, _particles.length);
    };

    /**
     * Get the topmost pixel where water exists.
     * @returns {Number} The topmost pixel where water exists.
     */
    this.getTop = () => _top;

    /**
     * Sample the vertical displacement.
     * @param {Number} x The X location in pixels to sample at.
     * @returns {Number} The vertical displacement in pixels.
     */
    this.sample = x => {
        const left = Math.floor(x / Water.INTERVAL);
        const f = (x - left * Water.INTERVAL) / Water.INTERVAL;

        return this.sampleIndex(left) + (this.sampleIndex(left + 1) - this.sampleIndex(left)) * f;
    };

    /**
     * Sample the derivative.
     * @param {Number} x The X location in pixels to sample at.
     * @returns {Number} The derivative of the waves at this point.
     */
    this.sampleDerivative = x => {
        const left = Math.floor(x / Water.INTERVAL);
        const f = (x - left * Water.INTERVAL) / Water.INTERVAL;

        return this.sampleDerivativeIndex(left) + (this.sampleDerivativeIndex(left + 1) - this.sampleDerivativeIndex(left)) * f;
    };

    /**
     * Sample the vertical displacement at an anchor point index.
     * @param {Number} i The index to sample at. Indices are separated by Water.INTERVAL pixels.
     * @returns {Number} The vertical displacement in pixels.
     */
    this.sampleIndex = i => {
        const index = i * Water.SCALE * Water.INTERVAL;
        const phase = _phase * Math.PI * 2;

        return (
            _octaves[0] * Math.cos(index * Water.WAVE_INDEX_SCALE_A - phase * Water.WAVE_SCALE_A) +
            _octaves[1] * Math.cos(index * Water.WAVE_INDEX_SCALE_B - phase * Water.WAVE_SCALE_B) +
            _octaves[2] * Math.cos(index * Water.WAVE_INDEX_SCALE_C - phase * Water.WAVE_SCALE_C)
        ) * Water.AMPLITUDE;
    };

    /**
     * Sample the slope at an anchor point index.
     * @param {Number} i The index to sample at. Indices are separated by Water.INTERVAL pixels.
     * @returns {Number} The derivative of the waves at this point.
     */
    this.sampleDerivativeIndex = i => {
        const index = i * Water.SCALE * Water.INTERVAL;
        const phase = _phase * Math.PI * 2;

        return (
            _octaves[0] * Water.WAVE_SCALE_A * Math.sin(index * Water.WAVE_INDEX_SCALE_A - phase * Water.WAVE_SCALE_A) +
            _octaves[1] * Water.WAVE_SCALE_B * Math.sin(index * Water.WAVE_INDEX_SCALE_B - phase * Water.WAVE_SCALE_B) +
            _octaves[2] * Water.WAVE_SCALE_C * Math.sin(index * Water.WAVE_INDEX_SCALE_C - phase * Water.WAVE_SCALE_C)
        ) * -Water.AMPLITUDE / Water.INTERVAL;
    };

    /**
     * Create the effect of a downwards splashing object in this water plane.
     * @param {Number} left The leftmost pixel where the object enters the water.
     * @param {Number} right The rightmost pixel where the object enters the water.
     * @param {Number} velocity The velocity of the object.
     * @param {Number} mass The mass of the object.
     */
    this.splashDown = (left, right, velocity, mass) => {
        const particleCount = Math.max(
            Water.SPLASH_PARTICLES_MIN,
            Math.ceil((right - left) * Water.PARTICLES_PER_PIXEL));

        for (let i = 0; i < particleCount; ++i) {
            const r = Math.random();
            const f = (1 - 2 * r) * (1 - 2 * r);
            const dir = Math.PI * (1.4 + f * 0.2);
            const speed = Math.min(
                Water.SPLASH_SPEED_MIN + Water.SPLASH_SPEED_MULTIPLIER * velocity * Math.pow(Math.random(), Water.SPLASH_SPEED_POWER),
                Water.SPLASH_SPEED_MAX);
            const radius = Math.min(
                Water.SPLASH_RADIUS_MIN + Water.SPLASH_RADIUS_MULTIPLIER * velocity * mass * Math.random(),
                Water.SPLASH_RADIUS_MAX);

            this.addParticle(
                left + (right - left) * f,
                Water.AMPLITUDE + radius,
                Math.cos(dir) * speed,
                Math.sin(dir) * speed,
                radius);
        }
    };

    /**
     * Displace water when moving through it.
     * @param {Number} x The pixel where the water is displaced from.
     * @param {Number} velocity The horizontal velocity of the object.
     * @param {Number} mass The mass of the object.
     */
    this.displace = (x, velocity, mass) => {
        const av = Math.abs(velocity);

        if (av < Water.DISPLACE_SPEED_THRESHOLD)
            return;

        const particleCount = 3;

        for (let i = 0; i < particleCount; ++i) {
            const radius = Water.DISPLACE_RADIUS_MIN + Water.DISPLACE_RADIUS_MULTIPLIER * mass * Math.random();

            this.addParticle(
                x,
                Water.AMPLITUDE + radius,
                Math.sign(velocity) * -Math.min(
                    av * Water.DISPLACE_SPEED_MULTIPLIER * Math.random() + Water.DISPLACE_SPEED_MIN,
                    Water.DISPLACE_SPEED_MAX),
                Math.max(
                    -av * Water.DISPLACE_SPEED_MULTIPLIER * Math.random() * Water.DISPLACE_UP_FACTOR - Water.DISPLACE_SPEED_MIN,
                    -Water.DISPLACE_SPEED_MAX),
                radius);
        }
    };
}

Water.Particle = function(x, y, vx, vy, radius) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
};

Water.AMPLITUDE = 3;
Water.WAVE_FUNCTION_PHASES = 3;
Water.WAVE_FUNCTION_FALLOFF = 1.3;
Water.WAVE_SCALE_A = 1;
Water.WAVE_SCALE_B = -1.41;
Water.WAVE_SCALE_C = 0.31;
Water.WAVE_INDEX_SCALE_A = 0.8;
Water.WAVE_INDEX_SCALE_B = 1.31;
Water.WAVE_INDEX_SCALE_C = 1.41;
Water.WAVE_PHASE_LIMIT = 100;
Water.INTERVAL = 16;
Water.SCALE = 0.08;
Water.SPEED = 1.2;
Water.GRAVITY = 260;
Water.PARTICLE_SHRINK = 6;
Water.PARTICLES_PER_PIXEL = 0.03;
Water.SPLASH_SPEED_THRESHOLD = 0.7;
Water.SPLASH_SPEED_POWER = 3;
Water.SPLASH_SPEED_MIN = 80;
Water.SPLASH_SPEED_MAX = 220;
Water.SPLASH_SPEED_MULTIPLIER = 40;
Water.SPLASH_RADIUS_MIN = 6;
Water.SPLASH_RADIUS_MAX = 50;
Water.SPLASH_RADIUS_MULTIPLIER = 0.3;
Water.SPLASH_PARTICLES_MIN = 8;
Water.DISPLACE_SPEED_THRESHOLD = 0.04;
Water.DISPLACE_RADIUS_MIN = 12;
Water.DISPLACE_RADIUS_MULTIPLIER = 0.1;
Water.DISPLACE_SPEED_MIN = 50;
Water.DISPLACE_SPEED_MAX = 200;
Water.DISPLACE_SPEED_MULTIPLIER = 50;
Water.DISPLACE_UP_FACTOR = 1.5;