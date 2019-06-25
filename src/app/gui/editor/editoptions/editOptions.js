import "../../../../styles/editoptions.css"

/**
 * A field for additional edit mode options.
 * @param {HTMLElement} overlay The element to place the toolbar on.
 * @constructor
 */
export function EditOptions(overlay) {
    const _container = document.createElement("div");

    const build = () => {
        _container.id = EditOptions.ID;
    };

    /**
     * Show an element in this edit options field.
     * @param {HTMLElement} element An element to show, or null to hide all.
     */
    this.set = element => {
        while (_container.firstChild)
            _container.removeChild(_container.firstChild);

        if (element)
            _container.appendChild(element);
    };

    /**
     * Hide the edit options.
     */
    this.hide = () => overlay.removeChild(_container);

    /**
     * Show the edit options.
     */
    this.show = () => overlay.appendChild(_container);

    build();
}

EditOptions.ID = "edit-options";
EditOptions.CLASS_CONTAINER = "container";
EditOptions.CLASS_TOOLBAR = "toolbar";