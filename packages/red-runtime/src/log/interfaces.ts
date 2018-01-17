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
