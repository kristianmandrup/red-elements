import {
  RED,
  readPage,
  ctx as baseCtx,
  Palette,
  PaletteEditor
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

let userSettings = {
  add() {}
}

import {
  common
} from '../../'

const {
  Popover,
  Tabs,
  Searchbox,
  EditableList
} = common.controllers

let popover = {
  create(ctx) {
    return Popover.create(ctx)
  }
}

let tabs = {
  create(ctx, RED) {
    return Tabs.create(ctx, RED)
  }
}

let ctx = Object.assign({
  actions,
  popover,
  tabs,
  text,
  events,
  settings,
  userSettings,
  nodes,
  view
}, baseCtx)


function createPalette(ctx) {
  return new Palette(ctx)
}

function createEditor(ctx) {
  return new PaletteEditor(ctx)
}

let palette, editor
beforeEach(() => {
  palette = createPalette(ctx)
  editor = createEditor(ctx)
})

export {
  RED,
  palette,
  editor,
  readPage,
  Searchbox,
  EditableList
}
