import "../styles/constants.css"
import "../styles/main.css"
import "../styles/gui.css"

import {Game} from "./game"
import {getString, Languages} from "./text/language";
import {RenderContext} from "./renderContext";
import {Input} from "./input/input";
import {User} from "./user/user";
import {loadParts} from "./utils/partLoader";

const start = (renderContext) => {
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

loadParts(["../mods/base.zip"], Languages.ENGLISH, new RenderContext(document.getElementById("renderer"), document.getElementById("overlay")), start);

