import "../styles/main.css"
import "../styles/gui.css"

import Myr from "../lib/myr.js"
import {Game} from "./game"
import {Sprites} from "./sprites"
import {getString} from "./language";

const KEY_CONTROL = "Control";

const canvas = document.getElementById("renderer");
const overlay = document.getElementById("overlay");
const myr = new Myr(canvas);
const sprites = new Sprites(myr);
const game = new Game(myr, sprites, overlay);

let canvasRect = overlay.getBoundingClientRect();
let keyControl = false;

document.title = getString("TITLE");
window.onresize = () => canvasRect = overlay.getBoundingClientRect();

overlay.addEventListener("mousemove", function(event) {
    game.onMouseMove(event.clientX - canvasRect.left, event.clientY - canvasRect.top);
});

overlay.addEventListener("mousedown", function(event) {
    if (event.target !== overlay)
        return;

    game.onMousePress();
});

overlay.addEventListener("mouseup", function(event) {
    game.onMouseRelease();
});

overlay.addEventListener("mouseenter", function(event) {
    if (event.target !== overlay)
        return;

    game.onMouseEnter(event.clientX - canvasRect.left, event.clientY - canvasRect.top);
});

overlay.addEventListener("mouseleave", function(event) {
    if (event.target !== overlay)
        return;

    game.onMouseLeave();
});

overlay.addEventListener("wheel", function(event) {
    if (event.target !== overlay)
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