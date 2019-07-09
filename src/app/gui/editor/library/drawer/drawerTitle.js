/**
 * The title of a drawer category element.
 * @param {String} title The title.
 * @param {DrawerPcbList} pcbList The drawer list which can collapse.
 * @constructor
 */
export function DrawerTitle(title, pcbList) {
    /**
     * Get the HTML element.
     * @returns {HTMLElement} The HTML element.
     */
    this.getElement = () => {
        const element = document.createElement("div");

        element.className = DrawerTitle.CLASS;
        element.innerText = title;
        element.onclick = () => pcbList.toggle();

        return element;
    };
}

DrawerTitle.CLASS = "drawer-title";