import "../styles/constants.css"
import "../styles/colors.css"
import "../styles/main.css"
import "../styles/gui.css"

import {Game} from "./game"
import {getString} from "./text/language";
import {RenderContext} from "./renderContext";
import {Input} from "./input/input";
import {User} from "./user/user";
import {loadParts} from "./loadParts";
import {Intro} from "./gui/loader/intro";
import {Loader} from "./loader/loader";
import {LoaderTask} from "./loader/loaderTask";

let user = null;
let input = null;
let game = null;

const start = renderContext => {
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
};

const renderContext = new RenderContext(
    document.getElementById("renderer"),
    document.getElementById("overlay"));
const intro = new Intro(renderContext.getOverlay());

new Loader([
    new LoaderTask(onFinished => {
        user = new User();

        onFinished();
    }),
    new LoaderTask(onFinished => {
        loadParts(
            user.getMods(),
            user.getLanguage(),
            renderContext,
            onFinished);
    }),
    new LoaderTask(onFinished => {
        input = new Input(window, renderContext);

        onFinished();
    }),
    new LoaderTask(onFinished => {
        game = new Game(renderContext, input, user);

        onFinished();
    })
],
() => {
    start(renderContext);

    intro.hide();
}).load();