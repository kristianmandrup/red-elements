// const Nightmare = require('nightmare')
// const nightmare = new Nightmare()
import * as matchers from 'jest-jquery-matchers'
export {
  controllers
}
from '../controllers'

beforeAll(done => {
  jest.addMatchers(matchers);
});
