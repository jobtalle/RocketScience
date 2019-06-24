import {FormLayout} from "../../../utils/formLayout";

/**
 * Terrain editor options.
 * @param {PcbEditorTerrain} editor The terrain editor.
 * @constructor
 */
export function EditOptionsTerrain(editor) {
    const _element = document.createElement("div");

    const makeRadiusSlider = () => {
        return FormLayout.makeSlider(
            1,
            64,
            1,
            editor.getRadius(),
            value => {
                editor.setRadius(value);
            });
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