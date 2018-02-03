import {
  clazzes,
  TYPES,
} from '../'

import {
  containers
} from '@tecla5/red-base'

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
  const type = TYPES.runtime[classTypeName]

  const clazz = clazzes[className]
  if (type && isClassy(clazz)) {
    containers.runtime.bind(type).to(clazz)
  }
})
