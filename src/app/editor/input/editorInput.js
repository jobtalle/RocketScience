import {Toolbar} from "./toolbar/toolbar";
import {PcbEditor} from "./pcb/pcbEditor";
import {Library} from "./library/library";

/**
 * Input elements of the editor.
 * @param {RenderContext} renderContext A render context;
 * @param {EditorOutput} output The output part of the editor.
 * @param {World} world A world.
 * @param {View} view The view.
 * @param {Object} game An interface to the Game object.
 * @constructor
 */
export function EditorInput(renderContext, output, world, view, game) {
    const _pcbEditor = new PcbEditor(
        renderContext,
        world,
        view,
        renderContext.getWidth() - renderContext.getViewport().getSplitX(),
        renderContext.getHeight(),
        renderContext.getViewport().getSplitX(),
        output.getInfo(),
        output.getOverlay());
    const _toolbar = new Toolbar(
        _pcbEditor,
        renderContext.getViewport().getElement(),
        renderContext.getViewport().getSplitX(),
        game);
    const _library = new Library(
        _pcbEditor,
        _toolbar,
        output.getInfo(),
        renderContext.getViewport().getElement(),
        renderContext.getViewport().getSplitX());


    this.getPcbEditor = () => _pcbEditor;
    this.getToolbar = () => _toolbar;
    this.getLibrary = () => _library;
}