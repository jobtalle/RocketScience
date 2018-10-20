/**
 * The title of a part category element.
 * @param {String} title The title.
 * @param {CategoryPartList} partList The part list which can collapse.
 * @constructor
 */
export function CategoryTitle(title, partList) {
    /**
     * Get the HTML element of this category.
     * @returns {HTMLElement} The HTML element of this category.
     */
    this.getElement = () => {
        const element = document.createElement("div");

        element.className = CategoryTitle.CLASS;
        element.innerText = title;
        element.onclick = () => partList.toggle();

        return element;
    };
}

CategoryTitle.CLASS = "category-title";