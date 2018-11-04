import {View} from "../../view/view";
import {ZoomProfile} from "../../view/zoomProfile";
import {ShiftProfile} from "../../view/shiftProfile";
import {MouseEvent} from "../../input/mouse/mouseEvent";
import * as Myr from "../../../lib/myr";
import {PcbEditor} from "./pcb/pcbEditor";
import {Toolbar} from "./toolbar/toolbar";
import {Library} from "./library/library";
import {Overlay} from "./overlay/overlay";
import {Info} from "./info/info";
import {PartSummary} from "../../pcb/partSummary";
import {Scale} from "../../world/scale";
import {Editables} from "./editables";

/**
 * Provides am editor for editing PCB's.
 * @param {RenderContext} renderContext A render context.
 * @param {World} world A world instance to interact with.
 * @param {Game} game A game.
 * @constructor
 */
export function Editor(renderContext, world, game) {
    const _overlay = new Overlay(renderContext.getViewport().getElement(), renderContext.getViewport().getSplitX());
    const _info = new Info(_overlay);
    const _view = new View(
        renderContext.getWidth() - renderContext.getViewport().getSplitX(),
        renderContext.getHeight(),
        new ZoomProfile(
            ZoomProfile.TYPE_ROUND,
            Editor.ZOOM_FACTOR,
            Editor.ZOOM_DEFAULT,
            Editor.ZOOM_MIN,
            Editor.ZOOM_MAX),
        new ShiftProfile(1));
    const _pcbEditor = new PcbEditor(
        renderContext,
        world,
        _view,
        renderContext.getWidth() - renderContext.getViewport().getSplitX(),
        renderContext.getHeight(),
        renderContext.getViewport().getSplitX(),
        this);
    const _toolbar = new Toolbar(
        _pcbEditor,
        renderContext.getViewport().getElement(),
        renderContext.getViewport().getSplitX(),
        game);
    const _library = new Library(
        _pcbEditor,
        _toolbar,
        _info,
        renderContext.getViewport().getElement());
    const _pcbScreenPosition = new Myr.Vector(0, 0);

    const _editables = new Editables(renderContext, world);
    let _editable = null;

    const onViewChanged = () => {
        _pcbScreenPosition.x = 0;
        _pcbScreenPosition.y = 0;

        _view.getInverse().apply(_pcbScreenPosition);
        _overlay.move(
            -_pcbScreenPosition.x,
            -_pcbScreenPosition.y,
            _view.getZoom());
    };

    /**
     * Get the info output GUI.
     * @returns {Info} The Info object.
     */
    this.getInfo = () => _info;

    /**
     * Get the overlay output GUI.
     * @returns {Overlay} The Overlay object.
     */
    this.getOverlay = () => _overlay;

    /**
     * The PCB has changed.
     */
    this.onPcbChange = () => {
        if (_editable.getBudget())
            _library.setBudget(_editable.getBudget(), new PartSummary(_editable.getPcb()));
        else
            _library.setBudget(_editable.getBudget(), null);
    };

    /**
     * Start editing a pcb.
     * @param {Editable} editable An editable.
     */
    this.edit = editable => {
        _editable = editable;

        _editables.setCurrent(editable);
        _pcbEditor.edit(editable);
        _toolbar.default();
    };

    /**
     * Hide the editor.
     */
    this.hide = () => {
        _toolbar.hide();
        _library.hide();
        _pcbEditor.hide();
        _overlay.hide();
    };

    /**
     * Show the editor.
     */
    this.show = () => {
        _pcbEditor.show();
        _library.show();
        _toolbar.show();
        _overlay.show();
    };

    /**
     * Call after the render context has resized.
     * @param {Number} width The width in pixels.
     * @param {Number} height The height in pixels.
     */
    this.resize = (width, height) => {
        _view.resize(width - renderContext.getViewport().getSplitX(), height);
    };

    /**
     * Update the state of the editor.
     * @param {Number} timeStep The number of seconds passed after the previous update.
     */
    this.update = timeStep => {
        _pcbEditor.update(timeStep);
    };

    /**
     * Render the editor.
     */
    this.draw = () => {
        renderContext.getMyr().push();
        renderContext.getMyr().transform(world.getView().getTransform());

        _editables.draw();

        renderContext.getMyr().primitives.drawLine(
            Myr.Color.BLUE,
            (_editable.getRegion().getOrigin().x + _editable.getOffset().x - 1) * Scale.PIXELS_PER_METER,
            (_editable.getRegion().getOrigin().y + _editable.getOffset().y) * Scale.PIXELS_PER_METER,
            (_editable.getRegion().getOrigin().x + _editable.getOffset().x + 1) * Scale.PIXELS_PER_METER,
            (_editable.getRegion().getOrigin().y + _editable.getOffset().y) * Scale.PIXELS_PER_METER);
        renderContext.getMyr().primitives.drawLine(
            Myr.Color.BLUE,
            (_editable.getRegion().getOrigin().x + _editable.getOffset().x) * Scale.PIXELS_PER_METER,
            (_editable.getRegion().getOrigin().y + _editable.getOffset().y - 1) * Scale.PIXELS_PER_METER,
            (_editable.getRegion().getOrigin().x + _editable.getOffset().x) * Scale.PIXELS_PER_METER,
            (_editable.getRegion().getOrigin().y + _editable.getOffset().y + 1) * Scale.PIXELS_PER_METER);
        renderContext.getMyr().primitives.drawRectangle(
            Myr.Color.RED,
            _editable.getRegion().getOrigin().x * Scale.PIXELS_PER_METER,
            _editable.getRegion().getOrigin().y * Scale.PIXELS_PER_METER,
            _editable.getRegion().getSize().x * Scale.PIXELS_PER_METER,
            _editable.getRegion().getSize().y * Scale.PIXELS_PER_METER);

        renderContext.getMyr().pop();

        _pcbEditor.draw();
    };

    /**
     * A mouse event has been fired.
     * @param {MouseEvent} event A mouse event.
     */
    this.onMouseEvent = event => {
        switch (event.type) {
            case MouseEvent.EVENT_PRESS_LMB:
                _pcbEditor.onMousePress(event.x - renderContext.getViewport().getSplitX(), event.y);

                break;
            case MouseEvent.EVENT_RELEASE_LMB:
                _pcbEditor.onMouseRelease(event.x - renderContext.getViewport().getSplitX(), event.y);

                break;
            case MouseEvent.EVENT_SCROLL:
                if (event.wheelDelta > 0)
                    _pcbEditor.zoomIn(event.x - renderContext.getViewport().getSplitX(), event.y);
                else
                    _pcbEditor.zoomOut(event.x - renderContext.getViewport().getSplitX(), event.y);

                break;
            case MouseEvent.EVENT_ENTER:
                _pcbEditor.onMouseEnter(event.x - renderContext.getViewport().getSplitX(), event.y);

                break;
            case MouseEvent.EVENT_LEAVE:
                _pcbEditor.onMouseLeave();

                break;
            case MouseEvent.EVENT_MOVE:
                _pcbEditor.onMouseMove(event.x - renderContext.getViewport().getSplitX(), event.y);

                break;
        }
    };

    /**
     * A key event has been fired.
     * @param {KeyEvent} event A key event.
     */
    this.onKeyEvent = event => {
        _toolbar.onKeyEvent(event);
        _pcbEditor.onKeyEvent(event);
    };

    /**
     * Free all resources occupied by this editor.
     */
    this.free = () => {
        _pcbEditor.free();
    };

    _view.setOnChanged(onViewChanged);
}

Editor.ZOOM_DEFAULT = 4;
Editor.ZOOM_FACTOR = 0.15;
Editor.ZOOM_MIN = 1;
Editor.ZOOM_MAX = 16;