import {TerrainSection} from "./terrainSection";
import {Scale} from "../world/scale";
import {Terrain} from "./terrain";

/**
 * A terrain renderer.
 * @param {Myr} myr A Myriad instance.
 * @param {Terrain} terrain A terrain to render.
 * @param {Scatters} scatters Scatters to render to the terrain.
 * @param {Fill} fill A terrain fill.
 * @constructor
 */
export function TerrainRenderer(myr, terrain, scatters, fill) {
    const makeSections = heights => {
        const sections = [];
        let scattersBegin = 0;
        let scattersEnd = scattersBegin;

        for (let section = 0; section < heights.length - 1; section += Terrain.SEGMENTS_PER_SECTION) {
            const offset = section * Terrain.PIXELS_PER_SEGMENT;

            while (
                scattersEnd < scatters.getSprites().length &&
                scatters.getSprites()[scattersEnd].x < offset + Terrain.SECTION_WIDTH)
                ++scattersEnd;

            while (
                scattersBegin < scattersEnd &&
                scatters.getSprites()[scattersBegin].x + scatters.getSprites()[scattersBegin].sprite.getWidth() <= offset)
                ++scattersBegin;

            sections.push(new TerrainSection(
                myr,
                Terrain.SECTION_WIDTH,
                Scale.PIXELS_PER_METER * Terrain.MAX_HEIGHT,
                Scale.PIXELS_PER_METER * Terrain.MAX_DEPTH,
                heights.slice(section, section + Terrain.SEGMENTS_PER_SECTION + 1),
                scatters.getSprites().slice(scattersBegin, scattersEnd),
                fill,
                offset));
        }

        return sections;
    };

    const _sections = makeSections(terrain.getHeights());

    /**
     * Draws the terrain.
     * @param {Number} left The left bound.
     * @param {Number} right The right bound.
     */
    this.draw = (left, right) => {
        const first = Math.max(Math.floor(left / Terrain.SECTION_WIDTH), 0);
        const last = Math.min(Math.ceil(right / Terrain.SECTION_WIDTH), _sections.length);

        for (let section = first; section < last; ++section)
            _sections[section].draw(section * Terrain.SECTION_WIDTH, -Terrain.SEGMENT_ELEVATION);
    };

    /**
     * Free this terrain renderer.
     */
    this.free = () => {
        for (const section of _sections)
            section.free();
    };
}