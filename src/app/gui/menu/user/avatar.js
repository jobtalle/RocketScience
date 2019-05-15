/**
 *
 * @constructor
 */
export function Avatar() {
    const _element = document.createElement("div");

    const make = () => {
        _element.id = Avatar.ID;

        const sprite = document.createElement("div");
        sprite.classList.add("sprite", "avatar-mr-tencent");
        sprite.id = Avatar.ID_CHARACTER;

        const background = document.createElement("div");
        background.classList.add("sprite", "avatar-background-blue");
        background.id = Avatar.ID_BACKGROUND;

        const border = document.createElement("div");
        border.classList.add("sprite", "avatar-border-gold");
        border.id = Avatar.ID_BORDER;

        _element.appendChild(background);
        _element.appendChild(sprite);
        _element.appendChild(border);
    };

    /**
     *
     * @returns {HTMLDivElement}
     */
    this.getElement = () => _element;

    make();
}

Avatar.ID = "avatar";
Avatar.ID_CHARACTER = "character";
Avatar.ID_BACKGROUND = "background";
Avatar.ID_BORDER = "border";