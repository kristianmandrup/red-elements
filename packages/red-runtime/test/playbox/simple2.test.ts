// import test factory functions
import {
  factories
} from './shared-tests'

// TEST all FlowManager delegations
describe('Nodes', () => {
  Object.keys(factories).map(label => {

    // essentially the beforeEach test setup using test factory
    const createTest = factories[label]

    // using different context + 1000
    const $test = createTest({
      number: Math.random() + 1000
    })

    test(label, $test)
  })
})

