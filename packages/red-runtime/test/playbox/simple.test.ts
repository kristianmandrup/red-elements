// import test factory functions
import {
  factories
} from './shared-tests'

// TEST all FlowManager delegations
describe('FlowManager', () => {
  Object.keys(factories).map(label => {

    // essentially the beforeEach test setup using test factory
    const createTest = factories[label]
    const $test = createTest({
      number: Math.random()
    })

    test(label, $test)
  })
})

