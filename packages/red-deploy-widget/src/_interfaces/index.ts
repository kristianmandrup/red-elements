export type JQElem = JQuery<HTMLElement>

export {
  INode,
  INodeDef,
  IEvents
  // ...
} from '@tecla5/red-base'

export {
  IUtil,
  INodes
  // ...
} from '@tecla5/red-runtime'


export interface ICommonUtils {

}


// TODO: re-export from red-interfaces
export interface IActions {

}

// TODO: re-export from red-interfaces
export interface INodeDiff {

}


export interface IUserSetting {
  t(key: string): string,
  add: Function,
  show(name: string)
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
