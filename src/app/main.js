import "../styles/constants.css"
import "../styles/main.css"
import "../styles/gui.css"

import {Game} from "./game"
import {getString} from "./language";
import {RenderContext} from "./renderContext";
import {Input} from "./input/input";

const renderContext = new RenderContext(
    document.getElementById("renderer"),
    document.getElementById("overlay"));
const input = new Input(window, renderContext);
const game = new Game(renderContext, input);

const resize = () => {
    const wrapper = document.getElementById("wrapper");
    const rect = renderContext.getOverlay().getBoundingClientRect();

    input.getMouse().setOrigin(rect.left, rect.top);
    renderContext.resize(wrapper.clientWidth, wrapper.clientHeight);
    game.resize(wrapper.clientWidth, wrapper.clientHeight);
};

document.title = getString("TITLE");
window.onresize = resize;

resize();

/*
renderContext.getOverlay().addEventListener("mousemove", function(event) {
    game.onMouseMove(event.clientX - canvasRect.left, event.clientY - canvasRect.top);
});

renderContext.getOverlay().addEventListener("mousedown", function(event) {
    if (event.target !== renderContext.getOverlay())
        return;

    game.onMousePress();
});

renderContext.getOverlay().addEventListener("mouseup", function() {
    game.onMouseRelease();
});

renderContext.getOverlay().addEventListener("mouseenter", function(event) {
    if (event.target !== renderContext.getOverlay())
        return;

    game.onMouseEnter(event.clientX - canvasRect.left, event.clientY - canvasRect.top);
});

renderContext.getOverlay().addEventListener("mouseleave", function(event) {
    if (event.target !== renderContext.getOverlay())
        return;

    game.onMouseLeave();
});

renderContext.getOverlay().addEventListener("wheel", function(event) {
    if (event.target !== renderContext.getOverlay())
        return;

    if (event.deltaY < 0)
        game.onZoomIn();
    else
        game.onZoomOut();
});
*/