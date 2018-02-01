export type JQElem = JQuery<HTMLElement>

export {
  INode,
  INodeDef,
  IEvents
  // ...
} from '@tecla5/red-base'

export {
  IActions
} from '../actions'

export {
  IKeyboard
} from '../keyboard'

export {
  ICanvas
} from '../canvas'

export {
  IClipboard
} from '../clipboard'

export {
  INodeDiff
} from '../node-diff'

export interface I18n {
  t(key: string): string
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
  IPanel
} from '../common'
