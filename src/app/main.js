import "../styles/main.css"

import Myr from "myr.js"
import {Game} from "./game"
import {Sprites} from "./sprites"

const KEY_CONTROL = "Control";

const canvas = document.getElementById("renderer");
const overlay = document.getElementById("overlay");
const myr = new Myr(canvas);
const sprites = new Sprites(myr);
const game = new Game(myr, sprites, overlay);

const canvasRect = overlay.getBoundingClientRect();

let key_control = false;

overlay.addEventListener("mousemove", function(event) {
    if (event.target !== overlay)
        return;

    game.onMouseMove(event.clientX - canvasRect.left, event.clientY - canvasRect.top);
});

overlay.addEventListener("mousedown", function(event) {
    if (event.target !== overlay)
        return;

    game.onMousePress(event.clientX - canvasRect.left, event.clientY - canvasRect.top);
});

overlay.addEventListener("mouseup", function(event) {
    if (event.target !== overlay)
        return;

    game.onMouseRelease(event.clientX - canvasRect.left, event.clientY - canvasRect.top);
});

overlay.addEventListener("mouseenter", function(event) {
    if (event.target !== overlay)
        return;

    game.onMouseEnter(event.clientX - canvasRect.left, event.clientY - canvasRect.top);
});

overlay.addEventListener("mouseleave", function(event) {
    if (event.target !== overlay)
        return;

    game.onMouseLeave(event.clientX - canvasRect.left, event.clientY - canvasRect.top);
});

overlay.addEventListener("mousewheel", function(event) {
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
            key_control = true;
            break;
        default:
            game.onKeyDown(event.key, key_control);
    }
};

window.onkeyup = event => {
    switch (event.key) {
        case KEY_CONTROL:
            key_control = false;
            break;
        default:
            game.onKeyUp(event.key);
    }
};