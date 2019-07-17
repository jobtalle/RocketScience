import "../styles/constants.css"
import "../styles/colors.css"
import "../styles/main.css"
import "../styles/gui.css"

import {Game} from "./game"
import {getString, Languages, setLanguage} from "./text/language";
import {RenderContext} from "./renderContext";
import {Input} from "./input/input";
import {User} from "./user/user";
import {loadParts} from "./utils/partLoader";
import {Intro} from "./gui/loader/intro";
import {Loader} from "./loader/loader";
import {LoaderTask} from "./loader/loaderTask";

const start = renderContext => {
    const user = new User();
    const input = new Input(window, renderContext);
    const game = new Game(renderContext, input, user);

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
const loader = new Loader([
    new LoaderTask(onFinished => {
        loadParts(
            ["../mods/base.zip"],
            Languages.ENGLISH,
            renderContext,
            onFinished);
    })
],
() => {
    intro.hide();

    start(renderContext);
});

loader.load();