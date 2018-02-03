export type JQElem = JQuery<HTMLElement>

export {
  INode,
  INodeDef,
  IEvents,
  ISubflow
  // ...
} from '@tecla5/red-base'

export {
  IUtil,
  INodes,
  ISettings,
  IRegistry,
  IHistory,
  II18n
  // ...
} from '@tecla5/red-runtime'

export {
  IBidi
} from '../text'

export {
  IActions
} from '../actions'

export {
  ICanvas
} from '../canvas'

export {
  IClipboard
} from '../clipboard'

export {
  IDeploy
} from '../deploy'

export {
  IKeyboard
} from '../keyboard'

export {
  INodeDiff
} from '../node-diff'

export {
  INodeEditor
} from '../node-editor'

export {
  INotifications
} from '../notifications'

export {
  IPalette,
  IPaletteEditor,
} from '../palette'

export {
  ITray
} from '../tray'

export {
  IMain
} from '../main'

export {
  IUser
} from '../user'

export {
  IUserSettings
} from '../user-settings'

export {
  IWorkspaces
} from '../workspaces'

export {
  IValidators
} from '../validators'

export {
  IRadialMenu
} from '../touch'

// TODO: maybe rename as IWidgetUtils and WidgetUtils ??
export {
  IUtils
} from '../utils'

export {
  ISidebar,
  ISidebarTabInfo
} from '../sidebar'

export interface IUserSetting {
  t(key: string): string,
  add: Function,
  show(name: string)
}

export interface IEditor {
  t(key: string): string,
  editSubflow(activeSubflow),
  edit(node)
  editConfig(name: string, type: any, id: number)
}

export interface IState {
  IMPORT_DRAGGING
}

export interface IView {
  focus()
}

export interface IState {
  JOINING,
  MOVING_ACTIVE,
  QUICK_JOINING,
  DEFAULT,
  IMPORT_DRAGGING,
  MOVING
}

export interface IText {
  bidi: {
    enforceTextDirectionWithUCC(l: any)
  }
}

export interface ITouch {
  radialMenu: {
    active()
  }
}

export interface IEditor {
  validateNode(nn: any)
  edit(nn: any)
  editSubflow(activeSubflow: any)
}

export {
  ITypeSearch
} from '../search/lib/type-search';

export interface I18nWidget extends JQElem {
  i18n: Function
}

export interface ITabSelect extends I18nWidget {
}

interface IDialog {
  remove()
}

export interface IButton extends JQElem {
  button: () => any
}
export interface IDialogElem extends JQElem {
  dialog: (name: string) => IDialog
}

export {
  IMenu,
  IPanel,
  IPopover,
  IStack,
  ITabs
} from '../common'
