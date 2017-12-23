// TODO:
// investigate legacy Library
// to figure out which class to use in each case
// set to real instance for each!
// See red-runtime
let actions = {
  add() { }
}
let keyboard = {
  add() { }
}

let utils = {
  getNodeIcon() {
    // url to icon
    return 'node/icon.png'
  }
}

let nodes = {
  getType() { },
  node(id?) {
    if (id === 'test1') {
      return { changed: {} }
    }
  },
  import() { return [[]] },
  createCompleteNodeSet() { },
  dirty() { },
  version() { },
  clear() { },
  workspace(id) { return { id: 'a' } },
  subflow() { }
}
let tray = {
  close() { },
  show(trayOpt) {
    trayOptions = trayOpt;
  }
}
let history = {
  push(evt) { }
}
let view = {
  redraw() { }
}
let palette = {
  refresh() { }
}
let workspaces = {
  refresh() { }
}
let sidebar = {
  config: {
    refresh() { }
  }
}

// let ctx = Object.assign({
//   actions,
//   keyboard,
//   utils,
//   // events,
//   // settings,
//   nodes,
//   tray,
//   history,
//   view,
//   palette,
//   sidebar,
//   workspaces
// }, baseCtx)
