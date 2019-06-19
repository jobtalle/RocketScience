import "../../../../styles/tabbar.css";
import {TabbarButton} from "./tabbarButton";
import {PhysicsPage} from "./pages/physicsPage";
import {getString} from "../../../text/language";
import {DescriptionPage} from "./pages/descriptionPage";

/**
 * The tabbar, which is located at the bottom of the level window.
 * @param {HTMLElement} overlay The element to place the toolbar on.
 * @param {Number} x The X position of the toolbar in pixels.
 * @param {World} world The current world.
 * @param {Boolean} isMissionEditor Enables mission editor functionality.
 * @constructor
 */
export function Tabbar(overlay, x, world, isMissionEditor) {
    const _container = document.createElement("div");
    const _toggleGroup = new TabbarButton.ToggleGroup();
    const _buttons = document.createElement("div");
    const _pageElement = document.createElement("div");
    let _page;

    const _buttonPhysics = new TabbarButton(
        (show) => _setPage(show, new PhysicsPage(world)),
        getString(Tabbar.TEXT_PHYSICS),
        "tabbar-physics",
        _toggleGroup
    );
    const _buttonDescription = new TabbarButton(
        (show) => _setPage(show, new DescriptionPage(world.getMission())),
        getString(Tabbar.TEXT_DESCRIPTION),
        "tabbar-description",
        _toggleGroup
    );

    const _setPage = (show, page) => {
        if (_page !== undefined)
            _pageElement.removeChild(_page.getElement());

        if (!show) {
            _page = undefined;

            return;
        }

        _pageElement.appendChild(page.getElement());

        _page = page;
    };

    const build = () => {
        _container.id = Tabbar.ID;
        _container.style.left = x + "px";

        _buttons.appendChild(_buttonPhysics.getElement());
        _buttons.appendChild(_buttonDescription.getElement());

        _buttons.classList.add("row");
        _pageElement.classList.add("row");

        _container.appendChild(_buttons);
        _container.appendChild(_pageElement);
    };

    /**
     * Show the tabbar.
     */
    this.show = () => {
        overlay.appendChild(_container);
    };

    /**
     * Hide the tabbar.
     */
    this.hide = () => {
        overlay.removeChild(_container);
    };

    if (isMissionEditor)
        build();
}

Tabbar.ID = "tabbar";

Tabbar.TEXT_COLLAPSE = "TABBAR_COLLAPSE";
Tabbar.TEXT_PHYSICS = "TABBAR_PHYSICS";
Tabbar.TEXT_DESCRIPTION = "TABBAR_DESCRIPTION";
