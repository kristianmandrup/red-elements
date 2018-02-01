import {
  delegateTarget,
} from './delegate-target'

import {
  delegator
} from './delegator'

// we want to have container as default arg to each decorator
export function createDecorators(container) {
  return {
    delegator(options = {}) {
      const opts = Object.assign(options, { container })
      return delegateTarget(opts)
    },
    delegateTarget(options = {}) {
      const opts = Object.assign(options, { container })
      return delegateTarget(opts)
    }
  }
}
