/**
 * Terrain editor options.
 * @constructor
 */
export function EditOptionsTerrain() {
    const _element = document.createElement("div");

    const build = () => {
        _element.className = EditOptionsTerrain.CLASS;
    };

    /**
     * Get the HTML element.
     * @returns {HTMLDivElement} The HTML element.
     */
    this.getElement = () => _element;

    build();
}

EditOptionsTerrain.CLASS = "container";