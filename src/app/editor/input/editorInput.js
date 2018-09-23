import {Toolbar} from "./toolbar/toolbar";
import {PcbEditor} from "./pcb/pcbEditor";
import {Library} from "./library/library";

/**
 * Input elements of the editor.
 * @param {RenderContext} renderContext A render context;
 * @param {EditorOutput} output The output part of the editor.
 * @param {Viewport} viewport A viewport.
 * @constructor
 */
export function EditorInput(renderContext, output, viewport, world, view, game) {
    const _pcbEditor = new PcbEditor(
        renderContext,
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