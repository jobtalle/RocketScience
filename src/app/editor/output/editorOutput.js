import {Overlay} from "./overlay/overlay";
import {Info} from "./info/info";

/**
 * Output elements of the editor.
 * @constructor
 */
export function EditorOutput(viewport) {
    const _overlay = new Overlay(viewport.getElement(), viewport.getSplitX());
    const _info = new Info(_overlay);

    this.getOverlay = () => _overlay;
    this.getInfo = () => _info;
}