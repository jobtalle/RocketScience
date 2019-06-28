/**
 * An editable part count field, which will update the part budget if modified.
 * @param {Object} budget An instance of BudgetInventory to modify.
 * @param {String} name The part name.
 * @param {Object} counter The part counter.
 * @constructor
 */
export function CategoryPartCountSetter(budget, name, counter) {
    const _element = document.createElement("div");

    const getCount = () => {
        const count = budget.getCount(name);

        if (count === null)
            return 0;
        else if (count === -1)
            return CategoryPartCountSetter.TEXT_INFINITE;

        return count;
    };

    const formatInput = value => {
        if (value === CategoryPartCountSetter.TEXT_INFINITE)
            return value;

        if (!isNaN(value) && value >= 0)
            return Math.min(value, CategoryPartCountSetter.COUNT_MAX);

        return getCount();
    };

    const makeField = () => {
        const element = document.createElement("input");

        element.value = getCount();
        element.onkeydown = element.onkeyup = event => event.stopPropagation();
        element.oninput = () => {
            let count;

            element.value = formatInput(element.value);

            if (element.value === CategoryPartCountSetter.TEXT_INFINITE || element.value === "")
                count = -1;
            else
                count = element.value;

            counter.set(count);
            budget.setCount(name, count);
        };

        return element;
    };

    const makeInfButton = field => {
        const element = document.createElement("button");

        element.innerText = CategoryPartCountSetter.TEXT_INFINITE;
        element.onclick = () => {
            field.value = CategoryPartCountSetter.TEXT_INFINITE;
            field.oninput();
        };

        return element;
    };

    const make = () => {
        const field = makeField();
        const button = makeInfButton(field);

        _element.classList.add(CategoryPartCountSetter.CLASS);
        _element.appendChild(field);
        _element.appendChild(button);
    };

    /**
     * Get the HTML element of this part count setter.
     * @returns {HTMLElement} The HTML element of this setter.
     */
    this.getElement = () => _element;

    make();
}

CategoryPartCountSetter.CLASS = "count-setter";
CategoryPartCountSetter.TEXT_INFINITE = String.fromCharCode(8734);
CategoryPartCountSetter.COUNT_MAX = 32767;