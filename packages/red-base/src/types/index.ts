import {
  widgets
} from './widgets'

import {
  runtime
} from './runtime'

const all = Object.assign({}, runtime, widgets)

export const TYPES = {
  widgets,
  runtime,
  all
}
