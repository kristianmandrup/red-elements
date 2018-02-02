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
  IBidi
  // ...
} from '@tecla5/red-runtime'

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
}

export interface IState {
  IMPORT_DRAGGING
}

export interface IView {
  focus()
}

export interface I18n {
  t(key: string): string,
  init: Function
}

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
