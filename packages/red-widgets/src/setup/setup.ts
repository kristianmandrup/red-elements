// import { Bottle } from "../../node_modules/bottlejs/dist/bottle";

import { Menu } from '../common/controllers';
import { Container, injectable, tagged, named } from 'inversify';
import 'reflect-metadata';
let container = new Container();
export let TYPES = { RED: 'IRED' };
export interface IRED {
  i18n: any;
  comms: any;
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
  notify(func, node, withTimeout?, timeout?);
  clipboard: any
}

@injectable()
export class RED implements IRED {
  public deploy = {};
  public diff = {};
  public notifications = {};
  public search = {};
  public palette: any
  public stack: any
  public comms: any
  public library = {
    loadFlowLibrary() { }
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
    focus() { },
    selection() { }
  }
  public text = {
    bidi: {
      // for renameTab
      resolveBaseTextDir(label) {
        return label;
      }
    }
  }
  public utils = {
    getNodeIcon(def) { },
    eachWorkspace(indexNode) { },
    getNodeLabel(l) { return l; }
  }
  public popover = {
    create(obj) { }
  }
  public nodes = {
    subflow(index) { },
    addLink(link) { },
    removeLink(link) { }
  }
  public sidebar = {
    info: {
      set(text) { }
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
    validateNode(node) { }
  }
  public userSettings = {
    toggle(elem) { }
  }
  public workspaces = {
    active() { }
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
    remove(selector) { },
    add(selector) { }
  }
  /**
   *  setDisabled
   */
  public menu = {
    setDisabled() { }
  }
  notify(func, node) { }
  public clipboard = {
    copyText(key, copyPath, msgPath) { }
  }
}
container.bind<IRED>(TYPES.RED).to(RED);
export { container };

// var RED = {
//   settings: {
//     theme(id) { },
//     get(settings) { },
//     set(settings, state) { },
//     remove(id) { }
//   },
//   actions: {
//     get(callback) { }
//   }
// }
// var bottle = new Bottle();
// var _RED = function () {
//   return RED;
// }
// bottle.service("RED", _RED);
// bottle.service("Menu", MenuFactory, 'RED');
// export { bottle };

