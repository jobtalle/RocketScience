import "../../../../styles/tabbar.css";
import {TabbarButton} from "./tabbarButton";
import {EmptyPage} from "./pages/emptyPage";
import {PhysicsPage} from "./pages/physicsPage";
import {getString} from "../../../text/language";

export function Tabbar(editor, overlay, x, world, isMissionEditor) {
    const _container = document.createElement("div");
    const _toggleGroup = new TabbarButton.ToggleGroup();
    const _buttons = document.createElement("div");
    const _pageElement = document.createElement("div");
    let _page;

    const _buttonCollapse = new TabbarButton(
        () => _setPage(new EmptyPage()),
        getString(Tabbar.TEXT_COLLAPSE),
        "tabbar-collapse",
        _toggleGroup
    );
    const _buttonPhysics = new TabbarButton(
        () => _setPage(new PhysicsPage(world)),
        getString(Tabbar.TEXT_PHYSICS),
        "tabbar-physics",
        _toggleGroup
    );

    const _setPage = page => {
        if (_page !== undefined)
            _pageElement.removeChild(_page.getElement());

        _pageElement.appendChild(page.getElement());

        _page = page;
    };

    const build = () => {
        _container.id = Tabbar.ID;
        _container.style.left = x + "px";

        _buttons.appendChild(_buttonCollapse.getElement());
        _buttons.appendChild(_buttonPhysics.getElement());

        _buttons.classList.add("row");
        _pageElement.classList.add("row");

        _container.appendChild(_buttons);
        _container.appendChild(_pageElement);

        _buttonCollapse.getElement().click();
    };

    this.show = () => overlay.appendChild(_container);

    this.hide = () => overlay.removeChild(_container);

    if (isMissionEditor)
        build();
}

Tabbar.ID = "tabbar";

Tabbar.TEXT_COLLAPSE = "TABBAR_COLLAPSE";
Tabbar.TEXT_PHYSICS = "TABBAR_PHYSICS";