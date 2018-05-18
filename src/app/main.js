import "../styles/main.css"

import Game from "./game"
import Sprites from "./sprites"
import Myr from "myr.js"

const canvas = document.getElementById("renderer");
const overlay = document.getElementById("overlay");
const myr = new Myr(canvas);
const sprites = new Sprites(myr);
const game = new Game(myr, sprites, overlay);