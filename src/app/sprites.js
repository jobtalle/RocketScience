import atlas from "../assets/sprites/atlas"

/**
 * Provides access to all sprites in the sprite atlas.
 * @param {Myr} myr Myriad object to create sprites with.
 * @constructor
 */
export function Sprites(myr) {
    const _surface = new myr.Surface(Sprites.ATLAS_PATH);

    const getFrame = (name, index) => {
        const frameName = name + '_' + index;
        return atlas.frames[frameName];
    };

    const registerSprite = name => {
        let frameIndex = 0;
        let frame = getFrame(name, '');
        if (frame == null)
            frame = getFrame(name, frameIndex);

        const spriteFrames = [];
        while (frame != null) {
            let spriteFrame = myr.makeSpriteFrame(_surface, frame.frame.x, frame.frame.y,
                                                  frame.frame.w, frame.frame.h, 0, 0,
                                                  frame.duration / 1000);

            spriteFrames.push(spriteFrame);
            frame = getFrame(name, ++frameIndex);
        }

        myr.register(name, ...spriteFrames);
    };

    /**
     * Return a sprite from the atlas.
     * @param {String} name The name of the sprite.
     * @returns {Myr.Sprite} Myriad sprite.
     */
    this.getSprite = name => {
        if (!myr.isRegistered(name))
            registerSprite(name);

        return new myr.Sprite(name);
    };
}

Sprites.ATLAS_PATH = "atlas.png";