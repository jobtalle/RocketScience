/**
 * A page where the settings for the physics can be adjusted.
 * @param {World} world The current world.
 * @constructor
 */
export function PhysicsPage(world) {
    const _element = document.createElement("div");

    const makeField = () => {
        const element = document.createElement("input");

        element.value = world.getMission().getPhysicsConfiguration().getGravityFactor().toString();
        element.onkeydown = element.onkeyup = event => event.stopPropagation();
        element.onchange = () => {
            if (isNaN(Number(element.value)))
                element.value = "0";

            if (Number(element.value) < PhysicsPage.MIN_GRAVITY_FACTOR)
                element.value = PhysicsPage.MIN_GRAVITY_FACTOR.toString();

            if (Number(element.value) > PhysicsPage.MAX_GRAVITY_FACTOR)
                element.value = PhysicsPage.MAX_GRAVITY_FACTOR.toString();

            world.getMission().getPhysicsConfiguration().setGravityFactor(Number(element.value));
            world.getPhysics().setGravity();
        };

        return element;
    };

    _element.classList.add(PhysicsPage.CLASS);
    _element.style.backgroundColor = PhysicsPage.BACKGROUND_COLOR;

    _element.appendChild(makeField());

    /**
     * Get the element of this page.
     * @returns {HTMLDivElement}
     */
    this.getElement = () => _element;
}

PhysicsPage.CLASS = "page";
PhysicsPage.MIN_GRAVITY_FACTOR = -1;
PhysicsPage.MAX_GRAVITY_FACTOR = 5;
PhysicsPage.BACKGROUND_COLOR = "#37946e";