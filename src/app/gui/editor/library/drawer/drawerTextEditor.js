/**
 * Editable text field for the title or name of the pcb.
 * @param {String} text The default text in the field.
 * @param {Function} onFinish The function that is called when an enter is pressed.
 * @constructor
 */
export function DrawerTitleEditor(text, onFinish) {
    const _element = document.createElement("input");

    const make = () => {
        _element.classList.add(DrawerTitleEditor.CLASS);
        _element.type = "text";
        _element.onkeydown = _element.onkeyup = event => event.stopPropagation();

        _element.value = text;
        _element.maxLength = DrawerTitleEditor.MAX_LENGTH;

        _element.addEventListener("keyup",
            (event) => {
                if (event.code === "Enter")
                    onFinish(_element.value);
        });
    };

    /**
     * Finishes the input.
     */
    this.finish = () => {
        onFinish(_element.value);
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement} The HTML element.
     */
    this.getElement = () => _element;

    make();
}

DrawerTitleEditor.MAX_LENGTH = 20;
DrawerTitleEditor.CLASS = "text-editor";