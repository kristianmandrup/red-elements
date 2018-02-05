export const runtime = {
  actions: 'IActions',
  event: {
    stack: 'IStack',
    undo: 'IUndo'
  },
  events: 'IEvents',
  communications: 'ICommunications',
  history: 'IHistory',
  i18n: 'II18n',
  logger: 'ILogger',
  node: 'INode',
  nodes: 'INodes',
  flow: 'IFlow',
  flows: 'IFlows',
  flowUtils: 'IFlowUtils',
  typeRegistry: 'IRegistry',
  settings: 'ISettings',
  localstorage: 'ILocalStorage',
  redUtils: 'IRedUtils',
  credentials: 'INodeCredentials',
  context: 'INodesContext'

  // .. TODO: more const to type name bindings, one for each class to be bound
}
