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
  Nodes,
  clazzes
} from '../'

function isClassy(clazz) {
  return typeof clazz === 'function'
}

// TODO: do bindings to runtime classes
// naive approach
// runtimeContainer.bind(TYPES.nodes).to(Nodes)
// more bindings using same pattern

// auto bind via conventions
Object.keys(clazzes).map(className => {
  const classTypeName = className.toLowerCase()
  const type = TYPES[classTypeName]

  const clazz = clazzes[className]
  if (type && isClassy(clazz)) {
    runtimeContainer.bind(type).to(clazz)
  }
})


export {
  runtimeContainer,
  TYPES
}
