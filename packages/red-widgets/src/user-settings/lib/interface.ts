export interface IUserSettings {
  configure()
  setSelected(id, value)
  toggle(id)
  add(id, value)
  show(name: string)
}
