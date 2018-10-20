import "../../../../styles/checklist.css"

/**
 * A checklist displaying all mission objectives.
 * @param {HTMLElement} overlay The element to place the checklist on.
 * @constructor
 */
export function Checklist(overlay) {
    let _container = document.createElement("div");

    const build = () => {
        _container.id = Checklist.ID;
    };

    /**
     * Show this checklist.
     */
    this.show = () => {
        overlay.appendChild(_container);
    };

    /**
     * Hide this checklist.
     */
    this.hide = () => {
        overlay.removeChild(_container);
    };

    build();
}

Checklist.ID = "checklist";