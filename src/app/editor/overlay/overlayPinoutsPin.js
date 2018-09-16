import {Pcb} from "../../pcb/pcb";
import {InfoPinouts} from "../info/pinouts/infoPinouts";

export function OverlayPinoutsPin(x, y, index) {
    this.getElement = () => {
        const element = document.createElement("div");

        element.className = OverlayPinoutsPin.CLASS;
        element.style.left = (x * Pcb.PIXELS_PER_POINT) + "px";
        element.style.top = (y * Pcb.PIXELS_PER_POINT) + "px";

        element.innerText = InfoPinouts.formatIndex(index);

        return element;
    };
}

OverlayPinoutsPin.CLASS = "pin";