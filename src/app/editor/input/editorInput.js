import {Toolbar} from "./toolbar/toolbar";
import {PcbEditor} from "./pcb/pcbEditor";
import {Library} from "./library/library";

/**
 * Input elements of the editor.
 * @constructor
 */
export function EditorInput(output, viewport, myr, sprites, world, view, game) {
    const _pcbEditor = new PcbEditor(
        myr,
        sprites,
        world,
        view,
        viewport.getWidth() - viewport.getSplitX(),
        viewport.getHeight(),
        viewport.getSplitX(),
        output.getInfo(),
        output.getOverlay());
    const _toolbar = new Toolbar(
        _pcbEditor,
        viewport.getElement(),
        viewport.getSplitX(),
        game);
    const _library = new Library(
        _pcbEditor,
        _toolbar,
        output.getInfo(),
        viewport.getElement(),
        viewport.getSplitX());


    this.getPcbEditor = () => _pcbEditor;
    this.getToolbar = () => _toolbar;
    this.getLibrary = () => _library;
}