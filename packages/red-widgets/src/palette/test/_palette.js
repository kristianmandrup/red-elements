import {
  RED,
  readPage,
  ctx as baseCtx,
  Palette
} from './imports'

// use instances from red-runtime
// inject RED singleton instead
let nodes = {
  eachSubflow(iterator) {
    let sf = {
      id: 'hello',
      name: 'Hello',
      in: [

      ],
      out: [

      ],
      info: false
    }
    iterator(sf)
  }
}
let events = {
  on() {}
}
let actions = {
  add() {}
}

let settings = {
  theme() {}
}

let view = {
  calculateTextWidth() {
    return 100
  }
}

let text = {
  bidi: {
    resolveBaseTextDir() {
      return 'my/text/dir'
    }
  }
}

import {
  common
} from '../../'

const {
  Popover,
  Searchbox
} = common.controllers


let popover = {
  create(ctx) {
    return Popover.create(ctx)
  }
}

let ctx = Object.assign({
  actions,
  popover,
  text,
  events,
  settings,
  nodes,
  view
}, baseCtx)


function create(ctx) {
  return new Palette(ctx)
}

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
