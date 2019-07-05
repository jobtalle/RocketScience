import {InfoPartSummaryEntryName} from "./infoPartSummaryEntryName";
import {InfoPartSummaryEntryCount} from "./infoPartSummaryEntryCount";
import {getString} from "../../../../text/language";

export function InfoPartSummaryEntry(part, count) {
    const _element = document.createElement("div");

    const make = () => {
        _element.className = InfoPartSummaryEntry.CLASS;

        _element.appendChild(new InfoPartSummaryEntryName(getString(part.label)).getElement());
        _element.appendChild(new InfoPartSummaryEntryCount(count).getElement());
    };

    /**
     * Get the HTML element of this part list.
     * @returns {HTMLElement} The HTML element of this part list.
     */
    this.getElement = () => _element;

    make();
}

InfoPartSummaryEntry.CLASS = "entry";