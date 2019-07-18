import {DrawerTitleButton} from "./drawerTitleButton"
import {DrawerTitleText} from "./drawerTitleText";
import {DrawerTitleEditor} from "./drawerTextEditor";

/**
 * The title of a drawer category element.
 * @param {User} user The user.
 * @param {PcbStorageDrawer} drawer The title.
 * @param {DrawerPcbList} pcbList The drawer list which can collapse.
 * @constructor
 */
export function DrawerTitle(user, drawer, pcbList) {
    const _element = document.createElement("div");
    let isEditable = false;

    const clearElement = () => {
        while (_element.firstChild)
            _element.removeChild(_element.firstChild);
    };

    const edit = (newTitle) => {
        if (isEditable) {
            isEditable = false;
            clearElement();

            user.setDrawerTitle(drawer, newTitle);
            _element.appendChild(new DrawerTitleText(newTitle, pcbList.toggle).getElement());
            _element.appendChild(new DrawerTitleButton(edit, "library-edit").getElement());
        } else {
            // Set to editable
            isEditable = true;
            clearElement();

            const editor = new DrawerTitleEditor(drawer.getTitle(), edit);
            _element.appendChild(editor.getElement());
            _element.appendChild(new DrawerTitleButton(editor.finish, "library-accept").getElement());
        }
    };

    const make = () => {
        _element.className = DrawerTitle.CLASS;

        _element.appendChild(new DrawerTitleText(drawer.getTitle(), pcbList.toggle).getElement());
        _element.appendChild(new DrawerTitleButton(edit, "library-edit").getElement());
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement} The HTML element.
     */
    this.getElement = () => _element;

    make();
}

DrawerTitle.CLASS = "drawer-title";
