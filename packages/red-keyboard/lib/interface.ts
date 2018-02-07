export interface IKeyboard {
  defaultKeyMap: Object
  actionToKeyMap: Object

  configure()
  add(scope: any, key: string, id: string, x?: boolean)
  remove(name: string, x?: boolean)
  getShortcut(actionName: string)
  formatKey(key: string)
  revertToDefault(action: string)
  parseKeySpecifier(key: string)
  resolveKeyEvent(evt)
  addHandler(scope: any, key: string, modifiers: Function | string, ondown: Function | string)
  removeHandler(key: string, modifiers: any)
  formatKey(key: string): string
  validateKey(key: string): boolean
  editShortcut(e, container?)
  endEditShortcut(cancel: boolean)
  buildShortcutRow(container: JQuery<HTMLElement>, object: any)
  getSettingsPane(): JQuery<HTMLElement>
  getShortcut(actionName: string): object
}
