import {
  createContainer
} from '@tecla5/red-base'

import {
  delegateTo,
  createDecorators,
} from '@tecla5/red-base'

// TODO: use widget container or merge widget level containers into higher lv widget container
export const container = createContainer({
  dev: 'development',
  test: 'testing',
})

import {
  lazyInject,
  TYPES
} from '../../_container'
const {
  delegateTarget,
  delegator
} = createDecorators(container)

export {
  delegateTo,
  delegateTarget,
  delegator,
  lazyInject,
  TYPES as $TYPES
}
