import "../../../../styles/info.css"
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
    const _stashedElement = [];
    const _stashedExtension = [];

    let _pinouts = null;
    let _selectedConfiguration = null;
    let _selectedX = 0;
    let _selectedY = 0;
    let _hover = false;

    const stash = () => {
        let element;

        while (element = _element.firstChild) {
            _stashedElement.push(element);
            _element.removeChild(element);
        }

        while (element = _extension.firstChild) {
            _stashedExtension.push(element);
            _extension.removeChild(element);
        }
    };

    const unstash = () => {
        for (const element of _stashedElement)
            _element.appendChild(element);

        for (const element of _stashedExtension)
            _extension.appendChild(element);

        _stashedElement.splice(0, _stashedElement.length);
        _stashedExtension.splice(0, _stashedExtension.length);
    };

    const mouseEnter = () => {
        if (_pinouts) {
            overlay.makePinouts(_selectedX, _selectedY, _selectedConfiguration);

            _hover = true;
        }
    };

    const mouseLeave = () => {
        if (_pinouts)
            overlay.clearPinouts();

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
        if (_pinouts)
            stash();
        else
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
            unstash();
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
            overlay.clearPinouts();

            _pinouts = null;
        }
    };

    /**
     * Display pinouts with one selected pin. Other pin numbers will not be shown.
     * @param {Object} configuration A valid part configuration to read pins from. May be null.
     * @param {Number} [x] The x position of a currently selected configuration.
     * @param {Number} [y] The y position of a currently selected configuration.
     * @param {Number} [index] The selected pin index.
     * @param {Myr.Vector} [direction] An optional direction for the highlighted pin label.
     */
    this.setPinoutsSelected = (configuration, x, y, index, direction) => {
        if (!configuration) {
            this.setPinouts(null);

            return;
        }

        clear();

        _pinouts = new InfoPinouts(configuration, _extension, index);
        _selectedConfiguration = configuration;
        _selectedX = x;
        _selectedY = y;

        _element.appendChild(_pinouts.getElement());

        if (index !== undefined) {
            overlay.makePinouts(_selectedX, _selectedY, _selectedConfiguration, index, direction);

            // TODO: 1 is a magic number here. Define border width in constants.css instead.
            _element.scrollTop = (_pinouts.getSelectedElement().clientHeight + 1) * index;
        }
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
Info.VAR_HEIGHT = "--info-height";