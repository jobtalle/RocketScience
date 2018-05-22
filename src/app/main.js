import "../styles/main.css"

import {Game} from "./game"
import {Sprites} from "./sprites"
import Myr from "myr.js"

const canvas = document.getElementById("renderer");
const overlay = document.getElementById("overlay");
const myr = new Myr(canvas);
const sprites = new Sprites(myr);
const game = new Game(myr, sprites, overlay);

const canvasRect = canvas.getBoundingClientRect();

canvas.addEventListener("mousemove", function(event) {
    game.onMouseMove(event.clientX - canvasRect.left, event.clientY - canvasRect.top);
});

canvas.addEventListener("mousedown", function(event) {
    game.onMousePress(event.clientX - canvasRect.left, event.clientY - canvasRect.top);
});

canvas.addEventListener("mouseup", function(event) {
    game.onMouseRelease(event.clientX - canvasRect.left, event.clientY - canvasRect.top);
});