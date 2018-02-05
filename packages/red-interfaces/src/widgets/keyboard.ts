export interface IKeyboard {
  configure()
  add: Function
  remove(name: string)
  getShortcut(actionName: string)
  formatKey(key: string)
}
