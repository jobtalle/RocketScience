import "../styles/main.css"

import Game from "./game.js"
import Myr from "myr.js"

const canvas = document.getElementById("renderer");
const overlay = document.getElementById("overlay");
const game = new Game(new Myr(canvas), overlay);