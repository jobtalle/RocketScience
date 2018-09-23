import "../styles/main.css"
import "../styles/gui.css"

import {Game} from "./game"
import {getString} from "./language";
import {RenderContext} from "./renderContext";

const KEY_CONTROL = "Control";

const renderContext = new RenderContext(
    document.getElementById("renderer"),
    document.getElementById("overlay"));
const game = new Game(renderContext);

let canvasRect = renderContext.getOverlay().getBoundingClientRect();
let keyControl = false;

document.title = getString("TITLE");
window.onresize = () => canvasRect = renderContext.getOverlay().getBoundingClientRect();

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

window.onkeydown = event => {
    switch (event.key) {
        case KEY_CONTROL:
            keyControl = true;
            break;
        default:
            game.onKeyDown(event.key, keyControl);
    }
};

window.onkeyup = event => {
    switch (event.key) {
        case KEY_CONTROL:
            keyControl = false;
            break;
        default:
            game.onKeyUp(event.key);
    }
};