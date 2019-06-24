import "../../styles/formlayout.css"

/**
 * A form like layout for label - input pairs.
 * @constructor
 */
export function FormLayout() {
    const _element = document.createElement("table");

    const make = () => {
        _element.className = FormLayout.CLASS;
    };

    /**
     * Add a pair to this form.
     * @param {HTMLElement} left A label.
     * @param {HTMLElement} right An element.
     */
    this.add = (left, right) => {
        const tr = document.createElement("tr");
        const thl = document.createElement("th");
        const thr = document.createElement("th");

        thl.appendChild(left);
        thr.appendChild(right);

        tr.appendChild(thl);
        tr.appendChild(thr);

        _element.appendChild(tr);
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement}
     */
    this.getElement = () => _element;

    make();
}

/**
 * Make a slider element with a connected text field.
 * @param {Number} min The minimum value.
 * @param {Number} max The maximum value.
 * @param {Number} step The step.
 * @param {Number} value The initial value.
 * @param {Function} onChange A function that is called whenever the value changes.
 */
FormLayout.makeSlider = (min, max, step, value, onChange) => {
    const wrapper = document.createElement("table");
    const tr = document.createElement("tr");
    const thl = document.createElement("th");
    const thr = document.createElement("th");
    const slider = document.createElement("input");
    const text = document.createElement("input");

    slider.type = "range";
    slider.min = min.toString();
    slider.max = max.toString();
    slider.step = step.toString();
    slider.value = value.toString();

    text.type = "text";
    text.readOnly = true;
    text.value = value.toString();
    text.maxLength = text.size = slider.max.length;

    slider.oninput = () => {
        text.value = slider.value;

        onChange(Number.parseFloat(text.value));
    };

    thl.appendChild(slider);
    thr.appendChild(text);

    tr.appendChild(thl);
    tr.appendChild(thr);

    wrapper.appendChild(tr);

    return wrapper;
};

FormLayout.CLASS = "form-layout";