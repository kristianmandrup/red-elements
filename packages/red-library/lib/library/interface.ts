export interface ILibrary {
  exportToLibraryDialog: any

  configure()
  postLibraryFlow(flowName)
  loadFlowsLibrary()
  createUI(options)
  exportFlow()
}
