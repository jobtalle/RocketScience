import "../styles/menu.css"

/**
 * The menu object creates an HTML menu which changes Game state.
 * @param {Object} game A constructed Game object to be controlled.
 * @constructor
 */
export default function Menu(game) {
    const ID_ROOT = "menu-root";
    const ID_BUTTONS = "menu-buttons";
    const CLASS_BUTTON = "menu-button";

    let _parent = null;

    const startCreate = () => {
        game.startCreate();

        this.hide();
    };

    const startChallenge = () => {
        game.startChallenge();

        this.hide();
    };

    const buildButtons = parent => {
        const create = document.createElement("button");
        create.appendChild(document.createTextNode("Create"));
        create.className = CLASS_BUTTON;
        create.onclick = () => startCreate();

        const challenge = document.createElement("button");
        challenge.appendChild(document.createTextNode("Challenge"));
        challenge.className = CLASS_BUTTON;
        challenge.onclick = () => startChallenge();

        parent.appendChild(create);
        parent.appendChild(challenge);
    };

    /**
     * Show the menu.
     * @param {Object} parent Show the start menu and add the elements to parent.
     */
    this.show = parent => {
        _parent = parent;

        const root = document.createElement("div");
        root.id = ID_ROOT;

        const buttons = document.createElement("div");
        buttons.id = ID_BUTTONS;

        buildButtons(buttons);

        root.appendChild(buttons);
        _parent.appendChild(root);
    };

    /**
     * Hide the menu.
     */
    this.hide = () => {
        while(_parent.firstChild)
            _parent.removeChild(_parent.firstChild);
    };
};