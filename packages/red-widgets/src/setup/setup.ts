// import { Bottle } from "../../node_modules/bottlejs/dist/bottle";

import { Menu } from "../common/controllers/menu";
// var inversify = require("inversify");
// require("reflect-metadata");
import { Container, injectable, tagged, named } from "inversify";
import "reflect-metadata";
let container = new Container();
export let TYPES = { RED: "IRED" };

export interface IRED {
  settings: any;
  actions: any;
  text: any;
  events: any;
  view: any;
  utils: any;
  popover: any;
  nodes: any;
  sidebar: any;
  _: any;
}

@injectable()
export class RED implements IRED {
  public settings = {
    theme(id) { },
    get(settings) { },
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
    focus() { }
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
    getNodeIcon(def) { }
  }
  public popover = {
    create(obj) { }
  }
  public nodes = {
    subflow(index) { }
  }
  public sidebar = {
    info: {
      set(text) { }
    }
  }
  public _ = function () { }
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

