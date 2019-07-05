import {InfoPartSummaryEntry} from "./InfoPartSummaryEntry";
import {getPartDefinitionFromName} from "../../../../part/objects";

export function InfoPartSummary(partSummary) {
    const _element = document.createElement("div");

    const make = () => {
        _element.className = InfoPartSummary.CLASS;

        const parts = partSummary.getAllParts();

        for (const part of parts) {
            _element.appendChild(new InfoPartSummaryEntry(getPartDefinitionFromName(part), partSummary.getPartCount(part))
                .getElement());
        }
    };

    /**
     * Get the HTML element of this part list.
     * @returns {HTMLElement} The HTML element of this part list.
     */
    this.getElement = () => _element;

    make();
}

InfoPartSummary.CLASS = "part-summary";