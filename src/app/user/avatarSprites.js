/**
 * Contains sprites to build the avatar.
 * @constructor
 */
export function AvatarSprites() {
    let _background = AvatarSprites.BACKGROUND_DEFAULT;
    let _character = AvatarSprites.CHARACTER_DEFAULT;
    let _border = AvatarSprites.BORDER_DEFAULT;

    /**
     * Set the background spite of the avatar.
     * @param {string} sprite The sprite class for the background
     */
    this.setBackgroundSprite = (sprite) => {
        _background = sprite;
    };

    /**
     * Get the background sprite of the avatar.
     * @returns {string} The sprite class for the background
     */
    this.getBackgroundSprite = () => _background;

    /**
     * Set the character sprite of the avatar
     * @param {string} sprite The sprite class for the character
     */
    this.setCharacterSprite = (sprite) => {
        _character = sprite;
    };

    /**
     * Get the character sprite of the avatar.
     * @returns {string} The sprite class for the character
     */
    this.getCharacterSprite = () => _character;

    /**
     * Set the border sprite of the avatar
     * @param {string} sprite The sprite class for the border
     */
    this.setBorderSprite = (sprite) => {
        _border = sprite;
    };

    /**
     * get the border sprite of the avatar.
     * @returns {string} The sprite class for the border
     */
    this.getBorderSprite = () => _border;
}

AvatarSprites.BACKGROUND_DEFAULT = "avatar-background-blue";
AvatarSprites.CHARACTER_DEFAULT = "avatar-clean";
AvatarSprites.BORDER_DEFAULT = "avatar-border-gold";