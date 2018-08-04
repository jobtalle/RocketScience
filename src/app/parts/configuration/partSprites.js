/**
 * The graphical representation of a part.
 * @param {Array} sprites An array of PartSprites.Sprite instances making up the part.
 * @constructor
 */
export function PartSprites(sprites) {
    /**
     * Get the sprites of the represented part.
     * @returns {Array} An array of PartSprites.Sprite instances making up the part.
     */
    this.getSprites = () => sprites;
}

/**
 * One of the sprites making up a part.
 * @param {Myr.Vector} offset The offset of this sprite with respect to the part origin.
 * @param {String} name The name the sprite is registered by through the Sprites object.
 * @constructor
 */
PartSprites.Sprite = function(offset, name) {
    this.getOffset = () => offset;
    this.getName = () => name;
};