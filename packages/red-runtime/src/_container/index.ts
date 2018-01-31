import {
  Container
} from 'inversify'

const TYPES = {
  actions: 'IActions',
  events: 'IEvents',
  communications: 'ICommunications',
  history: 'IHistory',
  i18n: 'II18n',
  node: 'INode',
  nodes: 'INodes',
  flow: 'IFlow',
  flows: 'IFlows',
  settings: 'ISettings',

  // .. TODO: more const to type name bindings, one for each class to be bound
}

const runtimeContainer = new Container()

import {
  Nodes
} from '../'

// TODO: do bindings to runtime classes
runtimeContainer.bind(TYPES.nodes).to(Nodes)
// more bindings using same pattern

export {
  runtimeContainer,
  TYPES
}
