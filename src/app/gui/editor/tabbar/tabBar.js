import "../../../../styles/tabbar.css";
import {TabBarButton} from "./tabBarButton";
import {PhysicsPage} from "./pages/physicsPage";
import {getString} from "../../../text/language";
import {DescriptionPage} from "./pages/descriptionPage";

/**
 * The tab bar, which is located at the bottom of the level window.
 * @param {HTMLElement} overlay The element to place the toolbar on.
 * @param {Number} xPosition The X position of the toolbar in pixels.
 * @param {World} world The current world.
 * @param {Boolean} isMissionEditor Enables mission editor functionality.
 * @constructor
 */
export function TabBar(overlay, xPosition, world, isMissionEditor) {
    const _container = document.createElement("div");
    const _toggleGroup = new TabBarButton.ToggleGroup();
    const _buttons = document.createElement("div");
    const _pageElement = document.createElement("div");
    let _page;

    const _buttonPhysics = new TabBarButton(
        (show) => _setPage(show, new PhysicsPage(world)),
        getString(TabBar.TEXT_PHYSICS),
        "tabbar-physics",
        _toggleGroup
    );
    const _buttonDescription = new TabBarButton(
        (show) => _setPage(show, new DescriptionPage(world.getMission())),
        getString(TabBar.TEXT_DESCRIPTION),
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
        _container.id = TabBar.ID;
        _container.style.left = xPosition + "px";

        _buttons.appendChild(_buttonPhysics.getElement());
        _buttons.appendChild(_buttonDescription.getElement());

        _buttons.classList.add("row");
        _pageElement.classList.add("row");

        _container.appendChild(_buttons);
        _container.appendChild(_pageElement);
    };

    /**
     * Show the tab bar.
     */
    this.show = () => {
        overlay.appendChild(_container);
    };

    /**
     * Hide the tab bar.
     */
    this.hide = () => {
        overlay.removeChild(_container);
    };

    if (isMissionEditor)
        build();
}

TabBar.ID = "tabbar";

TabBar.TEXT_COLLAPSE = "TABBAR_COLLAPSE";
TabBar.TEXT_PHYSICS = "TABBAR_PHYSICS";
TabBar.TEXT_DESCRIPTION = "TABBAR_DESCRIPTION";
