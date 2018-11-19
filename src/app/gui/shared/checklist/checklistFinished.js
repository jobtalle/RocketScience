import {getString} from "../../../text/language";
import {Game} from "../../../game";

/**
 * A button that appears on the checklist once all objectives are met.
 * @param {Game} game The game object.
 * @constructor
 */
export function ChecklistFinished(game) {
    const _element = document.createElement("div");

    const make = () => {
        _element.className = ChecklistFinished.CLASS;
        _element.onclick = onClick;
        _element.appendChild(document.createTextNode(getString(ChecklistFinished.TEXT)));
    };

    const onClick = () => {
        game.setMode(Game.MODE_MENU);
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement} The HTML element.
     */
    this.getElement = () => _element;

    make();
}

ChecklistFinished.CLASS = "finished";
ChecklistFinished.TEXT = "CHECKLIST_FINISHED";