export function PhysicsPage(world) {
    const _element = document.createElement("div");

    const makeField = () => {
        const element = document.createElement("input");

        element.value = world.getMission().getPhysicsConfiguration().getGravityFactor().toString();
        element.onkeydown = element.onkeyup = event => event.stopPropagation();
        element.oninput = () => {
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

    _element.appendChild(makeField());

    this.getElement = () => _element;
}

PhysicsPage.CLASS = "page";
PhysicsPage.MIN_GRAVITY_FACTOR = -1;
PhysicsPage.MAX_GRAVITY_FACTOR = 5;