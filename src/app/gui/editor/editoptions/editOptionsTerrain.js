/**
 * Terrain editor options.
 * @constructor
 */
export function EditOptionsTerrain() {
    const _element = document.createElement("div");

    const makeRadiusSlider = () => {
        const slider = document.createElement("input");

        slider.type = "range";
        slider.min = "1";
        slider.max = "64";
        slider.value = "8";

        return slider;
    };

    const build = () => {
        _element.className = EditOptionsTerrain.CLASS;

        _element.appendChild(makeRadiusSlider());
    };

    /**
     * Get the HTML element.
     * @returns {HTMLDivElement} The HTML element.
     */
    this.getElement = () => _element;

    build();
}

EditOptionsTerrain.CLASS = "container";