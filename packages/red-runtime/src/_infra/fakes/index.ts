import {
  container,
  injectable
} from '../injectable'

export let TYPES = { RED: 'IRED' };
export interface IRED {
  i18n: any;
  comms: any;
  user: any;
  deploy: any;
  diff: any;
  notifications: any;
  search: any;
  library: any;
  settings: any;
  actions: any;
  palette: any,
  stack: any,
  text: any;
  events: any;
  view: any;
  utils: any;
  popover: any;
  nodes: any;
  sidebar: any;
  _: any;
  tray: any;
  tabs: any;
  history: any;
  editor: any;
  userSettings: any;
  workspaces: any;
  subflow: any;
  state: any;
  typeSearch: any;
  touch: any;
  keyboard: any;
  menu: any;
  notify(func, node?, withTimeout?, timeout?);
  clipboard: any
}

@injectable()
export class RED implements IRED {
  public stack: any
  public user: any
  public deploy: any
  public notifications: any
  public search: any

  public diff = {
    getRemoteDiff() { }
  }

  public comms = {
    subscribe(name, cb) { },
  }

  public library = {
    loadFlowLibrary() { }
  }

  public palette = {
    refresh() { }
  }

  public i18n = {
    loadCatalog() { }
  }

  public settings = {
    theme(id) { },
    get(id) { return id },
    set(settings, state) { },
    remove(id) { }
  };
  public actions = {
    get(callback) { },
    add(selector, elem) { }
  }
  public events = {
    on(elem, fun) { },
    emit(elm) { }
  }
  public view = {
    ctxraw() { },
    redraw() { },
    focus() { },
    selection() {
      return [{
        id: 'x'
      }]  // nodes selected
    }
  }
  public text = {
    bidi: {
      enforceTextDirectionWithUCC(label) {
        return label
      },
      // for renameTab
      resolveBaseTextDir(label) {
        return label;
      }
    }
  }
  public utils = {
    getNodeIcon(def) { },
    eachWorkspace(indexNode) { },
    getNodeLabel(l) { return l; },
    validatePropertyExpression() { return true; }
  }
  public popover = {
    create(obj) {
      return {
        open() { },
        close() { }
      }
    }
  }
  public nodes = {
    removeSubflow() { },
    import(config) {
      return [{
        forEach(cb) {
          cb({
            id: 'x',
            type: 'subflow'
          })
        }
      }]
    },
    clear() { },
    version() { return '1' },
    createCompleteNodeSet() {
      return {} // nns
    },
    eachConfig(cb) {
      cb({
        // empty config
      })
    },
    eachNode(cb) {
      cb({
        id: 'x',
        in: [],
        out: []
      })
    },
    eachSubflow(cb) {
      // callback with a fake subflow
      cb({
        id: 'x',
        in: [],
        out: []
      })
    },
    refresh() { },
    dirty(node) { return false },
    registerType(type) { },
    getType() { return 'config' },
    subflow(index) { },
    addLink(link) { },
    removeLink(link) { },

    // filters all nodes w matching node props
    filterNodes(node) {
      return [{
        id: 'x',
        type: 'subflow',
        in: [],
        out: []
      }] // set of filtered nodes
    },
    workspace(id) {
      return {
        id: 'my-workspace'
      }
    },
    createExportableNodeSet(nodes) {
      return {
        id: 'x'
      }
    }
  }
  public sidebar = {
    info: {
      set(text) { }
    },
    config: {
      refresh() { }
    }
  }
  public _ = function () { }
  public tray = {
    close() { },
    show() { }
  }
  public tabs = {
    create(obj) { }
  }
  public history = {
    push(event) { }
  }
  public editor = {
    updateNodeProperties() { },
    validateNode(node) { }
  }
  public userSettings = {
    toggle(elem) { },
    add(setting) { },
  }
  public workspaces = {
    remove() { },
    refresh() { },
    active() {
      return {} // the currently active workspace
    }
  }
  public subflow = {
    refresh(val) { }
  }
  public state = {
    QUICK_JOINING: true,
    JOINING: true,
    DEFAULT: true,
    MOVING_ACTIVE: true,
    MOVING: true,
    IMPORT_DRAGGING: true
  }
  public typeSearch = {
    show(obj) { }
  }
  public touch = {
    radialMenu: {
      active: () => { }
    }
  }
  public keyboard = {
    getShortcut(action) {
      return 'x'
    },
    remove(selector) { },
    add(selector) { }
  }
  /**
   *  setDisabled
   */
  public menu = {
    init() { }, // creates Menu instance
    setDisabled() { }
  }
  notify(func, node?, a?, b?) { }
  public clipboard = {
    copyText(key, copyPath, msgPath) { }
  }
}
container.bind<IRED>(TYPES.RED).to(RED)
export { container }

