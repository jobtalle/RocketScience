import "../../../styles/info.css"
import {InfoTitle} from "./description/InfoTitle";
import {InfoDescription} from "./description/InfoDescription";
import {InfoPinouts} from "./pinouts/infoPinouts";

/**
 * An information box about the currently selected part.
 * @param {Overlay} overlay The overlay object to display additional information on.
 * @constructor
 */
export function Info(overlay) {
    const _element = document.createElement("div");
    const _extension = document.createElement("div");

    let _pinouts = null;
    let _selectedConfiguration = null;
    let _selectedX = 0;
    let _selectedY = 0;
    let _hover = false;

    const mouseEnter = () => {
        if (_pinouts) {
            overlay.makePinoutOverlay(_selectedX, _selectedY, _selectedConfiguration);

            _hover = true;
        }
    };

    const mouseLeave = () => {
        overlay.clear();

        _hover = false;
    };

    const make = () => {
        _element.id = Info.ID;
        _element.onmouseenter = () => mouseEnter();
        _element.onmouseleave = () => mouseLeave();

        _extension.id = Info.ID_EXTENSION;
    };

    const clear = () => {
        let element;

        while (element = _element.firstChild)
            _element.removeChild(element);

        while (element = _extension.firstChild)
            _extension.removeChild(element);
    };

    /**
     * The parent component is shown.
     */
    this.show = () => {

    };

    /**
     * The parent component is hidden.
     */
    this.hide = () => {
        mouseLeave();
    };

    /**
     * Display a part description in this box.
     * @param {String} title The title.
     * @param {String} text The text, which may contain HTML.
     */
    this.setText = (title, text) => {
        clear();

        _element.appendChild(new InfoTitle(title).getElement());
        _element.appendChild(new InfoDescription(text).getElement());
    };

    /**
     * Clear the current text.
     */
    this.clearText = () => {
        clear();

        if (_pinouts)
            _element.appendChild(_pinouts.getElement(_extension));
    };

    /**
     * Display pinout information.
     * @param {Object} configuration A valid part configuration to read pins from. May be null.
     * @param {Number} [x] The x position of a currently selected configuration.
     * @param {Number} [y] The y position of a currently selected configuration.
     */
    this.setPinouts = (configuration, x, y) => {
        clear();

        if (configuration) {
            _pinouts = new InfoPinouts(configuration, _extension);
            _selectedConfiguration = configuration;
            _selectedX = x;
            _selectedY = y;

            _element.appendChild(_pinouts.getElement());
        } else {
            overlay.clear();

            _pinouts = null;
        }
    };

    /**
     * Display pinouts with one selected pin. Other pin numbers will not be shown.
     * @param {Object} configuration A valid part configuration to read pins from. May be null.
     * @param {Number} [x] The x position of a currently selected configuration.
     * @param {Number} [y] The y position of a currently selected configuration.
     * @param {Number} [index] The selected pin index.
     */
    this.setPinoutsSelected = (configuration, x, y, index) => {
        if (!configuration) {
            this.setPinouts(null);

            return;
        }

        clear();

        _pinouts = new InfoPinouts(configuration, _extension, index);
        _selectedConfiguration = configuration;
        _selectedX = x;
        _selectedY = y;

        if (index !== undefined)
            overlay.makePinoutOverlay(_selectedX, _selectedY, _selectedConfiguration, index);

        _element.appendChild(_pinouts.getElement());
    };

    /**
     * Check if the cursor is hovering over this element.
     * @returns {Boolean} A boolean indicating whether the mouse hovers anywhere over the info box.
     */
    this.isHovering = () => _hover;

    /**
     * Get the HTML element of this info box.
     * @returns {HTMLElement} The HTML element of this part list.
     */
    this.getElement = () => _element;

    /**
     * Get the extension element of this info box.
     * @returns {HTMLElement} The HTML element of this info extension.
     */
    this.getExtension = () => _extension;

    make();
}

Info.ID = "info";
Info.ID_EXTENSION = "info-extension";