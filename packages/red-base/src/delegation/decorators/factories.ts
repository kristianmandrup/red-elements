import {
  delegateTarget,
} from './delegate-target'

import {
  delegator
} from './delegator'

// we want to have container bound to each of the functions returned
function createDecorators(container) {
  return function () {
    // very naive attempt
    // SOLUTIONS
    // http://clarkfeusier.com/2015/01/11/interview-question-function-bind.html
    // https://benmccormick.org/2015/11/30/es6-patterns-clean-higher-order-functions/

    const $delegator = delegator.bind(this)
    const $delegateTarget = delegateTarget.bind(this)

    return {
      delegator: $delegator
    }
  }
}
