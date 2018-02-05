export interface ILogMessage {
  name?: string
  id?: string
  timestamp?: number
  user?: any
  path?: any
  ip?: string
  type?: string
  level: number
  msg: any
}

export interface ILogger {
  addHandler(func: Function)
  removeHandler(func: Function)
  log(msg: ILogMessage)
  info(msg: any): void
  warn(msg: any)
  error(msg: any)
  trace(msg: any)
  debug(msg: any)
  metric()
  audit(msg: ILogMessage, req: any)
  _: Function
  t: Function
}
