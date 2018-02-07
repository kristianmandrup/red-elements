export interface IUserSettings {
  configure()
  setSelected(id, value)
  toggle(id)
  add(obj?: any)
  show(name: string)
}
