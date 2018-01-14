import {
  RED,
  readPage,
  widgets
} from '../_infra'

const {
  Palette,
  PaletteEditor,
  Popover,
  Tabs,
  Searchbox,
  EditableList
} = widgets

// TODO: Fix - make part of fake RED injectable!
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
  on() { }
}
let actions = {
  add() { }
}

let settings = {
  theme() { }
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
  add() { }
}

let popover = {
  create(ctx) {
    return Popover.create(ctx)
  }
}

let tabs = {
  create(options) {
    return Tabs.create(options)
  }
}

let ctx = {
  actions,
  popover,
  tabs,
  text,
  events,
  settings,
  userSettings,
  nodes,
  view
}


function createPalette() {
  return new Palette()
}

function createEditor() {
  return new PaletteEditor()
}

let palette, editor
beforeEach(() => {
  palette = createPalette()
  editor = createEditor()
})

export {
  RED,
  palette,
  editor,
  readPage,
  Searchbox,
  EditableList
}
