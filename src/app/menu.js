import "../styles/menu.css"

/**
 * The menu object creates an HTML menu which changes Game state.
 * @param {Object} game A constructed Game object to be controlled.
 * @param {Object} parent A parent element to add the menu elements to.
 * @constructor
 */
export default function Menu(game, parent) {
    const ID_ROOT = "menu-root";
    const ID_BUTTONS = "menu-buttons";
    const CLASS_BUTTON = "menu-button";

    const buildButtons = parent => {
        const create = document.createElement("button");
        create.appendChild(document.createTextNode("Create"));
        create.className = CLASS_BUTTON;

        const challenge = document.createElement("button");
        challenge.appendChild(document.createTextNode("Challenge"));
        challenge.className = CLASS_BUTTON;

        parent.appendChild(create);
        parent.appendChild(challenge);
    };

    const buildInterface = parent => {
        const root = document.createElement("div");
        root.id = ID_ROOT;

        const buttons = document.createElement("div");
        buttons.id = ID_BUTTONS;

        buildButtons(buttons);

        root.appendChild(buttons);
        parent.appendChild(root);
    };

    buildInterface(parent);
};