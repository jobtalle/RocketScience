/**
 * The graphical representation of the avatar
 * @param avatarSprites {AvatarSprites} The AvatarSprites object
 * @constructor
 */
export function Avatar(avatarSprites) {
    const _element = document.createElement("div");

    const make = () => {
        _element.id = Avatar.ID;

        const sprite = document.createElement("div");
        sprite.classList.add("sprite");
        sprite.classList.add(avatarSprites.getCharacterSprite());
        sprite.id = Avatar.ID_CHARACTER;

        // const background = document.createElement("div");
        // background.classList.add("sprite");
        // background.classList.add(avatarSprites.getBackgroundSprite());
        // background.id = Avatar.ID_BACKGROUND;
        //
        // const border = document.createElement("div");
        // border.classList.add("sprite");
        // border.classList.add(avatarSprites.getBorderSprite());
        // border.id = Avatar.ID_BORDER;

        // _element.appendChild(background);
        _element.appendChild(sprite);
        // _element.appendChild(border);
    };

    /**
     * Get the HTML element
     * @returns {HTMLDivElement} The HTML element
     */
    this.getElement = () => _element;

    make();
}

Avatar.ID = "avatar";
Avatar.ID_CHARACTER = "character";
Avatar.ID_BACKGROUND = "background";
Avatar.ID_BORDER = "border";