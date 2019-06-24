import {FormLayout} from "../../../utils/formLayout";

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

    const makeIcon = sprite => {
        const icon = document.createElement("div");

        icon.className = "icon sprite " + sprite;

        return icon;
    };

    const build = () => {
        const form = new FormLayout();

        form.add(
            makeIcon(EditOptionsTerrain.ICON_BRUSH_WIDTH),
            makeRadiusSlider());

        _element.className = EditOptionsTerrain.CLASS;
        _element.appendChild(form.getElement());
    };

    /**
     * Get the HTML element.
     * @returns {HTMLDivElement} The HTML element.
     */
    this.getElement = () => _element;

    build();
}

EditOptionsTerrain.CLASS = "container";
EditOptionsTerrain.ICON_BRUSH_WIDTH = "terrain-brush-width";