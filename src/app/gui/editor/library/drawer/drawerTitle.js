/**
 * The title of a part category element.
 * @param {String} title The title.
 * @param {DrawerPcbList} pcbList The part list which can collapse.
 * @constructor
 */
export function DrawerTitle(title, pcbList) {
    /**
     * Get the HTML element of this category.
     * @returns {HTMLElement} The HTML element of this category.
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