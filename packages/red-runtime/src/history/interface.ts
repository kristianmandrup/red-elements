export interface IHistory {
  list: any[]
  depth: number

  // TODO: this function is a placeholder
  // until there is a 'save' event that can be listened to
  markAllDirty()

  push(ev: IEvent)
  pop()
  peek(): any
  undo()
}
