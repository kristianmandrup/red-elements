import * as $d3 from './d3'
import * as d3Select from '../lib/d3-selection'
import * as d3Transform from '../lib/d3-transform'

const d3 = Object.assign({}, $d3, d3Select, d3Transform)

export {
  d3
}
