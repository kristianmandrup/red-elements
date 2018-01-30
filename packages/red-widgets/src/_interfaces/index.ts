import { JQElem } from '@tecla5/red-base';

export {
  JQElem
}

export {
  INode,
  INodeDef,
  // ...
} from '@tecla5/red-base'

export interface I18nWidget extends JQElem {
  i18n: Function
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
