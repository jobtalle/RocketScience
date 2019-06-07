/**
 * An empty page, with an element that is an empty div. Used for the collapsing tabbar.
 * @constructor
 */
export function EmptyPage() {
    const _element = document.createElement("div");

    /**
     * Get the element of the Page.
     * @returns {HTMLDivElement}
     */
    this.getElement = () => _element;
}