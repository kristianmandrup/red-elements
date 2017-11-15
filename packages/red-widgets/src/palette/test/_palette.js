import {
  RED,
  readPage,
  ctx as baseCtx,
  Palette
} from './imports'

// use instances from red-runtime
// inject RED singleton instead
let nodes = {}
let events = {
  on() {}
}
let actions = {
  add() {}
}

let settings = {
  theme() {}
}

let ctx = Object.assign({
  actions,
  // keyboard,
  // utils,
  events,
  settings,
  nodes,
  // view
}, baseCtx)


function create(ctx) {
  return new Palette(ctx)
}

import {
  common
} from '../../'

const {
  Searchbox
} = common.controllers


let palette
beforeEach(() => {
  palette = create(ctx)
})

export {
  RED,
  palette,
  readPage,
  Searchbox
}
