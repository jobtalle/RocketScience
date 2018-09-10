/**
 * The index of a pinout.
 * @param {Number} index The pin index.
 * @constructor
 */
export function InfoPinoutEntryIndex(index) {
    this.getElement = () => {
        const element = document.createElement("div");

        element.className = InfoPinoutEntryIndex.CLASS;
        element.innerText = index.toString();

        return element;
    }
}

InfoPinoutEntryIndex.CLASS = "pinout-index";