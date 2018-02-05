export interface IMenu {
  menuItems: any
  createMenuItem(opt)
  setInitialState(opt, link)
  triggerAction(id, args?)
  isSelected(id)
  setSelected(id, state)
  toggleSelected(id)
  setDisabled(id, state)
  addItem(id, opt)
  removeItem(id)
  setAction(id, action)
  init(opt)
}
