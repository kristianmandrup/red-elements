import {
  Container
} from 'inversify'

import {
  TYPES,
  containers,
  createDecorators,
  createContainer,
  delegateTo
} from '@tecla5/red-base'

import getDecorators from 'inversify-inject-decorators';
export const { lazyInject } = getDecorators(containers.runtime)

// TODO: use widget container or merge widget level containers into higher lv widget container
export const container = createContainer({
  dev: 'development',
  test: 'testing',
})

const {
  delegateTarget,
  delegator
} = createDecorators(container)

export {
  delegateTo,
  delegateTarget,
  delegator,
  TYPES as $TYPES
}
