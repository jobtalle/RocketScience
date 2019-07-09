import {PartSummary} from "../../../../pcb/partSummary";

export function DrawerPcb(pcb, setPcb, info) {
    const _element = document.createElement("div");

    const onClick = () => {
        info.clearText();

        setPcb(pcb.copy());
    };

    const onEnter = () => {
        info.setPartSummary(new PartSummary(pcb));
    };

    const onLeave = () => info.clearText();

    const makeSprite = () => {
        const element = document.createElement("div");

        element.classList.add("sprite");
        element.classList.add("library-stored-pcb");
        element.onclick = onClick;
        element.onmouseover = onEnter;
        element.onmouseout = onLeave;

        return element;
    };

    const make = () => {
        _element.classList.add(DrawerPcb.CLASS);
        _element.appendChild(makeSprite());
    };

    /**
     * Get the HTML element of this category.
     * @returns {HTMLElement} The HTML element of this category.
     */
    this.getElement = () => _element;

    make();
}

DrawerPcb.CLASS = "drawer-pcb";