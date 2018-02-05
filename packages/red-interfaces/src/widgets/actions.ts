export interface IActions {
  count: number
  add(name, handler)
  remove(name)
  get(name)
  invoke(name)
  list()
}
