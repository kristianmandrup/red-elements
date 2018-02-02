import {
  Container
} from 'inversify'

import {
  TYPES,
  containers
} from '@tecla5/red-base'

import getDecorators from 'inversify-inject-decorators';
export const { lazyInject } = getDecorators(containers.runtime)

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
  const type = TYPES.runtime[classTypeName]

  const clazz = clazzes[className]
  if (type && isClassy(clazz)) {
    containers.runtime.bind(type).to(clazz)
  }
})

// export {
//   TYPES
// }
