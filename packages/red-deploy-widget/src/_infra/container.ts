import {
  createContainer
} from '@tecla5/red-base'

export {
  delegateTarget,
  delegator,
  delegateTo,
  createDecorators
} from '@tecla5/red-base'

// TODO: use widget container or merge widget level containers into higher lv widget container
export const container = createContainer({
  dev: 'development',
  test: 'testing',
})


