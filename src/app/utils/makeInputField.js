/**
 * Create an input field with a description text.
 * @param {String} initialValue The initial value of the input field.
 * @param {Function} onChange This function needs to take a string argument, and return a string.
 * @param {String} description
 * @param {Number} size The size of the input field.
 * @returns {HTMLDivElement}
 */
export function makeInputField(initialValue, onChange, description, size) {
    const element = document.createElement("div");

    const field = document.createElement("input");

    if (description)
        element.textContent = description + " ";

    field.value = initialValue;
    field.onkeydown = field.onkeyup = event => event.stopPropagation();
    field.onchange = () => {
        field.value = onChange(field.value);
    };
    if (size)
        field.size = size;

    element.appendChild(field);

    return element;
}
