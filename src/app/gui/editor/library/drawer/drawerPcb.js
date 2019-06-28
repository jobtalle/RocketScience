export function DrawerPcb(pcb, setPcb, info) {
    const _element = document.createElement("div");

    const onClick = () => {
        info.clearText();

        setPcb(pcb);
    };

    const onEnter = () => info.setText("PCB", "text");

    const onLeave = () => info.clearText();

    const makeSprite = () => {
        const element = document.createElement("div");

        element.classList.add("sprite");
        // element.classList.add();
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