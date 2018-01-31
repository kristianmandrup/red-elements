import {
  Container
} from 'inversify'

const TYPES = {
  NODES: 'INodes',
  // .. TODO: more const to type name bindings, one for each class to be bound
}

const runtimeContainer = new Container()

import {
  Nodes
} from '../'

// TODO: do bindings to runtime classes
runtimeContainer.bind(TYPES.NODES).to(Nodes)
// more bindings using same pattern

export {
  runtimeContainer
}
