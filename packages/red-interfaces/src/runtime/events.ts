export interface IEvents {
  handlers: any
  lastEmitted: any

  on(evt: string, func: Function)
  off(evt: string, func: Function)
  emit(evt: string, arg?: any)
}
