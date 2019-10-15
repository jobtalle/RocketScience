/**
 * A number field.
 * @param {Number} number The initial value.
 * @param {Function} onChange A function to call when the value changes.
 * @param {Number} minValue The minimum value that can be given.
 * @param {Number} maxValue The maximum value that can be given.
 * @constructor
 */
export function NumberField(number, onChange, minValue=null, maxValue=null) {
    const _element = document.createElement("input");

    const make = () => {
        _element.type = "number";
        _element.value = number.toString();
        _element.onkeydown = _element.onkeyup = event => event.stopPropagation();

        if (minValue !== null)
            _element.min = minValue.toString();
        if (maxValue !== null)
            _element.max = maxValue.toString();

        _element.onchange = () => onChange(_element.value);
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement} The element.
     */
    this.getElement = () => _element;

    make();
}