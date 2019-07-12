import {FormLayout} from "../../../utils/formLayout";
import {ToolbarButton} from "../../../utils/toolbarButton";
import {getString} from "../../../text/language";
import {PcbEditorTerrain} from "../pcb/pcbEditorTerrain";
import {EditOptions} from "./editOptions";

/**
 * Terrain editor options.
 * @param {PcbEditorTerrain} editor The terrain editor.
 * @constructor
 */
export function EditOptionsTerrain(editor) {
    const _element = document.createElement("div");

    const makeRadiusSlider = () => {
        return FormLayout.makeSlider(
            0,
            16,
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

    const buildToolbar = () => {
        const wrapper = document.createElement("div");
        const toggleGroup = new ToolbarButton.ToggleGroup();
        const buttonModeElevate = new ToolbarButton(
            () => editor.setMode(PcbEditorTerrain.MODE_ELEVATE),
            getString(EditOptionsTerrain.TEXT_MODE_ELEVATE),
            "terrain-mode-elevate",
            ToolbarButton.TYPE_TOGGLE_GROUP,
            toggleGroup);
        const buttonModeSmooth = new ToolbarButton(
            () => editor.setMode(PcbEditorTerrain.MODE_SMOOTH),
            getString(EditOptionsTerrain.TEXT_MODE_SMOOTH),
            "terrain-mode-smooth",
            ToolbarButton.TYPE_TOGGLE_GROUP,
            toggleGroup);
        const buttonModeFlatten = new ToolbarButton(
            () => editor.setMode(PcbEditorTerrain.MODE_FLATTEN),
            getString(EditOptionsTerrain.TEXT_MODE_FLATTEN),
            "terrain-mode-flatten",
            ToolbarButton.TYPE_TOGGLE_GROUP,
            toggleGroup);

        wrapper.className = EditOptions.CLASS_TOOLBAR;
        wrapper.appendChild(buttonModeElevate.getElement());
        wrapper.appendChild(buttonModeSmooth.getElement());
        wrapper.appendChild(buttonModeFlatten.getElement());

        buttonModeElevate.getElement().click();

        return wrapper;
    };

    const build = () => {
        const form = new FormLayout();

        form.add(
            makeIcon(EditOptionsTerrain.ICON_BRUSH_WIDTH),
            makeRadiusSlider());

        _element.className = EditOptions.CLASS_CONTAINER;
        _element.appendChild(buildToolbar());
        _element.appendChild(form.getElement());
    };

    /**
     * Get the HTML element.
     * @returns {HTMLDivElement} The HTML element.
     */
    this.getElement = () => _element;

    build();
}

EditOptionsTerrain.ICON_BRUSH_WIDTH = "terrain-brush-width";
EditOptionsTerrain.TEXT_MODE_ELEVATE = "TERRAIN_MODE_ELEVATE";
EditOptionsTerrain.TEXT_MODE_SMOOTH = "TERRAIN_MODE_SMOOTH";
EditOptionsTerrain.TEXT_MODE_FLATTEN = "TERRAIN_MODE_FLATTEN";