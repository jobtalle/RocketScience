import "../styles/main.css"

import Myr from "myr.js"
import {Game} from "./game"
import {Sprites} from "./sprites"

const canvas = document.getElementById("renderer");
const overlay = document.getElementById("overlay");
const myr = new Myr(canvas);
const sprites = new Sprites(myr);
const game = new Game(myr, sprites, overlay);

const canvasRect = canvas.getBoundingClientRect();
let mouseDown = false;

window.addEventListener("mousemove", function(event) {
    game.onMouseMove(event.clientX - canvasRect.left, event.clientY - canvasRect.top);
});

window.addEventListener("mousedown", function(event) {
    game.onMousePress(event.clientX - canvasRect.left, event.clientY - canvasRect.top);

    mouseDown = true;
});

window.addEventListener("mouseup", function(event) {
    game.onMouseRelease(event.clientX - canvasRect.left, event.clientY - canvasRect.top);

    mouseDown = false;
});

window.addEventListener("mouseenter", function(event) {
    game.onMouseEnter(event.clientX - canvasRect.left, event.clientY - canvasRect.top);
});

window.addEventListener("mouseleave", function(event) {
    game.onMouseLeave(event.clientX - canvasRect.left, event.clientY - canvasRect.top);

    if(mouseDown) {
        game.onMouseRelease(event.clientX - canvasRect.left, event.clientY - canvasRect.top);

        mouseDown = false;
    }
});