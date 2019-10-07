/**
 * A number field.
 * @param {Number} number The initial value.
 * @param {Function} onChange A function to call when the value changes.
 * @constructor
 */
export function NumberField(number, onChange) {
    const _element = document.createElement("input");

    const make = () => {
        _element.type = "number";
        _element.value = number.toString();

        _element.onchange = () => onChange(_element.value);
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement} The element.
     */
    this.getElement = () => _element;

    make();
}