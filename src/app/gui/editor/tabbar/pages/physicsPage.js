import {makeInputField} from "../../../../utils/makeInputField";
import {getString} from "../../../../text/language";

/**
 * A page where the settings for the physics can be adjusted.
 * @param {World} world The current world.
 * @constructor
 */
export function PhysicsPage(world) {
    const _element = document.createElement("div");

    const build = () => {
        _element.classList.add(PhysicsPage.CLASS);

        _element.appendChild(makeInputField(world.getMission().getPhysicsConfiguration().getGravityFactor().toString(), value => {
            if (isNaN(Number(value)))
                value = "0";

            if (Number(value) < PhysicsPage.MIN_GRAVITY_FACTOR)
                value = PhysicsPage.MIN_GRAVITY_FACTOR.toString();

            if (Number(value) > PhysicsPage.MAX_GRAVITY_FACTOR)
                value = PhysicsPage.MAX_GRAVITY_FACTOR.toString();

            world.getMission().getPhysicsConfiguration().setGravityFactor(Number(value));
            world.getPhysics().setGravity();

            return value;
        }, getString(PhysicsPage.GRAVITY_LABEL), PhysicsPage.GRAVITY_INPUT_SIZE));
    };

    build();

    /**
     * Get the element of this page.
     * @returns {HTMLDivElement}
     */
    this.getElement = () => _element;
}

PhysicsPage.CLASS = "page";
PhysicsPage.MIN_GRAVITY_FACTOR = -1;
PhysicsPage.MAX_GRAVITY_FACTOR = 5;
PhysicsPage.GRAVITY_LABEL = "TABPAGE_PHYSICS_LABEL";
PhysicsPage.GRAVITY_INPUT_SIZE = 1;
