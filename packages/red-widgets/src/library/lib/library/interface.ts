export interface ILibrary {
  configure()
  postLibraryFlow(flowName)
  loadFlowsLibrary()
  createUI(options)
  exportFlow()
}
