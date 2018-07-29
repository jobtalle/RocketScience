export function PartConfiguration(footprint, pinLayout, partSprites) {
    this.getFootprint = () => footprint;
    this.getPinLayout = () => pinLayout;
    this.getPartSprites = () => partSprites;
}