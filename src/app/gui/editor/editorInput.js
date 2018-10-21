import {Toolbar} from "./toolbar/toolbar";
import {PcbEditor} from "./pcb/pcbEditor";
import {Library} from "./library/library";

/**
 * Input elements of the editor.
 * @param {RenderContext} renderContext A render context;
 * @param {EditorOutput} output The output part of the editor.
 * @param {World} world A world.
 * @param {View} view The view.
 * @param {Game} game A game.
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
        output);
    const _toolbar = new Toolbar(
        _pcbEditor,
        renderContext.getViewport().getElement(),
        renderContext.getViewport().getSplitX(),
        game);
    const _library = new Library(
        _pcbEditor,
        _toolbar,
        output.getInfo(),
        renderContext.getViewport().getElement());

    /**
     * Show the editors.
     */
    this.show = () => {
        _pcbEditor.show();
        _library.show();
        _toolbar.show();
    };

    /**
     * Hide the editors.
     */
    this.hide = () => {
        _toolbar.hide();
        _library.hide();
        _pcbEditor.hide();
    };

    /**
     * Free all resources.
     */
    this.free = () => {
        _pcbEditor.free();
    };

    /**
     * Update the editors.
     * @param {Number} timeStep The number of seconds passed since the last update.
     */
    this.update = timeStep => {
        _pcbEditor.update(timeStep);
    };

    /**
     * Start editing a pcb.
     * @param {Editable} editable An editable.
     */
    this.edit = editable => {
        _pcbEditor.edit(editable);

        // Defaulting the toolbar creates the default PCB editor
        _toolbar.default();
    };

    /**
     * Draw the editor.
     */
    this.draw = () => {
        _pcbEditor.draw();
    };

    /**
     * A key event has been fired.
     * @param {KeyEvent} event A key event.
     */
    this.onKeyEvent = event => {
        _pcbEditor.onKeyEvent(event);
        _toolbar.onKeyEvent(event);
    };

    /**
     * Zoom in.
     * @param {Number} x The mouse x position in pixels.
     * @param {Number} y The mouse y position in pixels.
     */
    this.zoomIn = (x, y) => {
        _pcbEditor.zoomIn(x, y);
    };

    /**
     * Zoom out.
     * @param {Number} x The mouse x position in pixels.
     * @param {Number} y The mouse y position in pixels.
     */
    this.zoomOut = (x, y) => {
        _pcbEditor.zoomOut(x, y);
    };

    /**
     * Press the mouse.
     * @param {Number} x The mouse x position in pixels.
     * @param {Number} y The mouse y position in pixels.
     */
    this.onMousePress = (x, y) => {
        _pcbEditor.onMousePress(x, y);
    };

    /**
     * Release the mouse.
     */
    this.onMouseRelease = () => {
        _pcbEditor.onMouseRelease();
    };

    /**
     * The mouse enters the editor area.
     * @param {Number} x The mouse x position in pixels.
     * @param {Number} y The mouse y position in pixels.
     */
    this.onMouseEnter = (x, y) => {
        _pcbEditor.onMouseEnter(x, y);
    };

    /**
     * The mouse leaves the editor area.
     */
    this.onMouseLeave = () => {
        _pcbEditor.onMouseLeave();
    };

    /**
     * The mouse has moved.
     * @param {Number} x The mouse x position in pixels.
     * @param {Number} y The mouse y position in pixels.
     */
    this.onMouseMove = (x, y) => {
        _pcbEditor.onMouseMove(x, y);
    };
}