export interface INotifications {
  /**
   * Notify with message
   * @param msg
   * @param type
   * @param fixed
   * @param timeout
   */
  notify(msg, type?: string, fixed?, timeout?: number)
  update?()
  close?()
  call: Function
}
