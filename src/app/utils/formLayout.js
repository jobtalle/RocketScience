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

FormLayout.CLASS = "form-layout";