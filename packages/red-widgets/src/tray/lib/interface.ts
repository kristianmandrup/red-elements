export interface ITray {
  /**
   * Configure Tray
   */

  configure()

  show(options)

  handleWindowResize()

  close(): Promise<any>
}
